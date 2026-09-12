import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  Printer, 
  RotateCcw, 
  ExternalLink, 
  X, 
  FileText, 
  Download, 
  Sparkles, 
  CheckCircle, 
  Loader2,
  Eye,
  Layers
} from 'lucide-react';

// Configure pdfjs worker
try {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '6.3.289'}/build/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('Could not set pdfjs worker source:', e);
}

// Calibration constants for bottom-front output tray & slit
const TRAY_SLANT = -0.597; // Downward tray pitch angle (~ -34.2°)
const PAPER_WIDTH = 0.65;
const PAPER_HEIGHT = 0.92; // Standard A4 1:1.414 aspect ratio (~0.65 * 1.414)
const SLOT_START_POS = { x: 0, y: -0.11, z: 0.36 }; // Inside dispenser slit
const TRAY_END_POS = { x: 0, y: -0.43, z: 0.84 }; // Settled flush on front tray

/**
 * Draw Page 1 (Front) branded document fallback
 */
function drawBrandedDocument(canvas, title = 'Student Document', orderId = 'CP-0000', pages = 1, colorMode = 'bw') {
  canvas.width = 1024;
  canvas.height = 1448; // Standard A4 aspect ratio
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background sheet
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle border frame
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

  // Top header block
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(56, 56, canvas.width - 112, 90);

  // Logo & text
  ctx.fillStyle = '#FFD028';
  ctx.font = 'bold 38px "Space Grotesk", sans-serif';
  ctx.fillText('CAMPUS PRINT', 84, 114);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 20px "Space Grotesk", sans-serif';
  ctx.fillText('PAGE 1 (FRONT)', canvas.width - 250, 110);

  // Document Title
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 44px sans-serif';
  const cleanTitle = title.length > 28 ? title.slice(0, 26) + '…' : title;
  ctx.fillText(cleanTitle, 80, 220);

  // Metadata ribbon
  ctx.fillStyle = colorMode === 'color' ? '#EEF2FF' : '#F1F5F9';
  ctx.fillRect(80, 250, canvas.width - 160, 50);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 250, canvas.width - 160, 50);

  ctx.font = '700 20px monospace';
  ctx.fillStyle = '#1E293B';
  ctx.fillText(`JOB: #${orderId}   |   PAGES: ${pages}   |   DUPLEX: 2-SIDED`, 104, 282);

  // Decorative text rows simulating printed body paragraphs
  const startY = 340;
  const numLines = 24;
  for (let i = 0; i < numLines; i++) {
    const y = startY + i * 36;
    if (y > canvas.height - 230) break;

    let width = canvas.width - 160;
    if (i % 6 === 5) width *= 0.55;
    else if (i % 4 === 3) width *= 0.8;

    if (colorMode === 'color' && (i === 4 || i === 5)) {
      ctx.fillStyle = i === 4 ? '#3B82F6' : '#10B981';
    } else {
      ctx.fillStyle = i % 2 === 0 ? '#475569' : '#64748B';
    }
    ctx.fillRect(80, y, width, 14);
  }

  // Barcode block
  const barcodeY = canvas.height - 180;
  ctx.fillStyle = '#0F172A';
  let curX = 80;
  const barPattern = [4, 8, 3, 12, 6, 2, 8, 4, 10, 6, 3, 9, 14, 4, 8, 5, 10, 3, 8, 12, 4, 6, 9];
  for (const w of barPattern) {
    ctx.fillRect(curX, barcodeY, w, 50);
    curX += w + 6;
  }
  ctx.font = '16px monospace';
  ctx.fillStyle = '#64748B';
  ctx.fillText(`*${orderId || 'CAMPUS-PRINT'}*`, 80, barcodeY + 74);

  // Official Stamp Watermark
  ctx.save();
  ctx.translate(canvas.width - 240, canvas.height - 150);
  ctx.rotate((-12 * Math.PI) / 180);
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 5;
  ctx.strokeRect(-110, -40, 220, 80);
  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 26px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DISPATCHED', 0, -6);
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('CAMPUS PRINT LAB', 0, 20);
  ctx.restore();
}

/**
 * Draw Page 2 (Back) branded document fallback for duplex printing
 */
function drawBrandedBackDocument(canvas, title = 'Student Document', orderId = 'CP-0000', pages = 1, colorMode = 'bw') {
  canvas.width = 1024;
  canvas.height = 1448;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background sheet
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle border frame
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

  // Top header ribbon
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(56, 56, canvas.width - 112, 74);

  ctx.fillStyle = '#FFD028';
  ctx.font = 'bold 30px "Space Grotesk", sans-serif';
  ctx.fillText('CAMPUS PRINT', 84, 106);

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 20px "Space Grotesk", sans-serif';
  ctx.fillText('PAGE 2 / 2 (BACK SIDE)', canvas.width - 320, 104);

  // Subtitle
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(`Document Summary & Annexure: ${title.slice(0, 30)}`, 80, 180);

  // Body content lines simulating text on back of duplex sheet
  const startY = 220;
  const numLines = 24;
  for (let i = 0; i < numLines; i++) {
    const y = startY + i * 36;
    if (y > canvas.height - 240) break;

    let width = canvas.width - 160;
    if (i % 5 === 4) width *= 0.58;
    else if (i % 3 === 2) width *= 0.82;

    ctx.fillStyle = i % 2 === 0 ? '#475569' : '#64748B';
    ctx.fillRect(80, y, width, 14);
  }

  // Verification & Watermark box
  const boxY = canvas.height - 210;
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(80, boxY, canvas.width - 160, 130);
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, boxY, canvas.width - 160, 130);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 20px "Space Grotesk", sans-serif';
  ctx.fillText('OFFICIAL CAMPUS PRINT DUPLEX CERTIFICATION', 104, boxY + 40);

  ctx.font = '15px monospace';
  ctx.fillStyle = '#475569';
  ctx.fillText(`JOB TOKEN: CP-TOKEN-${orderId} · 2-SIDED REVERSE VERIFIED`, 104, boxY + 75);
  ctx.fillText('AUTHENTICATED HARDWARE SIMULATION DISPATCH', 104, boxY + 104);
}

/**
 * Interactive 3D Printer Component using Three.js, GSAP & 2-Sided PDF.js Texturing
 */
export const PrinterDemo = forwardRef(function PrinterDemo(
  {
    pdfUrl = '',
    order = null,
    autoPrint = false,
    height = '440px',
    showControls = true,
    title = 'Physical Print Simulator',
    orderStatus = 'placed',
    onPrintStart = null,
    onPrintComplete = null,
    onTriggerDemo = null,
  },
  ref
) {
  const containerRef = useRef(null);
  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);

  // Three.js instances
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const printerGroupRef = useRef(null);
  const paperGroupRef = useRef(null);
  const frontTextureRef = useRef(null);
  const backTextureRef = useRef(null);
  const animationFrameRef = useRef(null);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });

  // UI state
  const [modelLoading, setModelLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrinted, setIsPrinted] = useState(
    orderStatus === 'ready' || orderStatus === 'completed'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('sheet'); // 'sheet' | 'pdf'
  const [sheetSide, setSheetSide] = useState('front'); // 'front' | 'back'
  const [printCount, setPrintCount] = useState(0);

  // Keep references for raycasting & event handlers
  const isPrintedRef = useRef(false);
  isPrintedRef.current = isPrinted;
  const isPrintingRef = useRef(false);
  isPrintingRef.current = isPrinting;

  const fileName = order?.fileName || 'document.pdf';
  const orderId = order?.orderId || 'CP-9021';
  const pages = order?.pages || 1;
  const colorMode = order?.options?.colorMode || 'bw';

  /**
   * Sound effect synthesis using Web Audio API for tactile feedback
   */
  const playSound = useCallback((type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'motor') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.5);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 2.0);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.3);
      } else if (type === 'complete') {
        const now = ctx.currentTime;
        const o1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        o1.type = 'sine';
        o1.frequency.setValueAtTime(587.33, now); // D5
        g1.gain.setValueAtTime(0.05, now);
        g1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        o1.connect(g1);
        g1.connect(ctx.destination);
        o1.start(now);
        o1.stop(now + 0.4);

        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.type = 'sine';
        o2.frequency.setValueAtTime(880, now + 0.15); // A5
        g2.gain.setValueAtTime(0.06, now + 0.15);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        o2.connect(g2);
        g2.connect(ctx.destination);
        o2.start(now + 0.15);
        o2.stop(now + 0.6);
      }
    } catch {
      // Audio autoplay policy or not supported
    }
  }, []);

  /**
   * 2-Sided Texture Rendering: Page 1 on Front, Page 2 on Back
   */
  const updatePaperTexture = useCallback(
    async (targetUrl) => {
      const frontCanvas = frontCanvasRef.current || document.createElement('canvas');
      const backCanvas = backCanvasRef.current || document.createElement('canvas');
      frontCanvasRef.current = frontCanvas;
      backCanvasRef.current = backCanvas;

      // Always draw default template first
      drawBrandedDocument(frontCanvas, fileName, orderId, pages, colorMode);
      drawBrandedBackDocument(backCanvas, fileName, orderId, pages, colorMode);

      if (frontTextureRef.current) frontTextureRef.current.needsUpdate = true;
      if (backTextureRef.current) backTextureRef.current.needsUpdate = true;

      if (!targetUrl) return;

      // Check if it's an image file
      const isImg = /\.(png|jpe?g|webp|gif)($|\?)/i.test(targetUrl) || targetUrl.startsWith('data:image/');
      if (isImg) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            frontCanvas.width = 1024;
            frontCanvas.height = 1448;
            const ctx = frontCanvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, frontCanvas.width, frontCanvas.height);
              const scale = Math.min((frontCanvas.width - 80) / img.width, (frontCanvas.height - 80) / img.height);
              const w = img.width * scale;
              const h = img.height * scale;
              const x = (frontCanvas.width - w) / 2;
              const y = (frontCanvas.height - h) / 2;
              ctx.drawImage(img, x, y, w, h);
              if (frontTextureRef.current) frontTextureRef.current.needsUpdate = true;
            }
          };
          img.src = targetUrl;
          return;
        } catch (e) {
          console.warn('Could not load image onto paper texture:', e);
        }
      }

      // Try 2-Sided PDF.js rendering
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: targetUrl,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '6.3.289'}/cmaps/`,
          cMapPacked: true,
        });
        const pdf = await loadingTask.promise;

        // 1. Render Page 1 (Front Face)
        const page1 = await pdf.getPage(1);
        const viewport1 = page1.getViewport({ scale: 2.0 });
        frontCanvas.width = viewport1.width;
        frontCanvas.height = viewport1.height;
        const ctx1 = frontCanvas.getContext('2d');
        if (ctx1) {
          ctx1.fillStyle = '#ffffff';
          ctx1.fillRect(0, 0, frontCanvas.width, frontCanvas.height);
          await page1.render({ canvasContext: ctx1, viewport: viewport1 }).promise;
          if (frontTextureRef.current) frontTextureRef.current.needsUpdate = true;
        }

        // 2. Render Page 2 (Back Face) if available (Duplex Document)
        if (pdf.numPages >= 2) {
          const page2 = await pdf.getPage(2);
          const viewport2 = page2.getViewport({ scale: 2.0 });
          backCanvas.width = viewport2.width;
          backCanvas.height = viewport2.height;
          const ctx2 = backCanvas.getContext('2d');
          if (ctx2) {
            ctx2.fillStyle = '#ffffff';
            ctx2.fillRect(0, 0, backCanvas.width, backCanvas.height);
            await page2.render({ canvasContext: ctx2, viewport: viewport2 }).promise;
            if (backTextureRef.current) backTextureRef.current.needsUpdate = true;
          }
        } else {
          // If 1-page document, keep branded back page
          drawBrandedBackDocument(backCanvas, fileName, orderId, pages, colorMode);
          if (backTextureRef.current) backTextureRef.current.needsUpdate = true;
        }
      } catch (err) {
        console.info('PDF.js render fallback to branded template:', err?.message || err);
      }
    },
    [fileName, orderId, pages, colorMode]
  );

  /**
   * GSAP Paper Printing Animation & Tray Trajectory
   * Triggered at 3.0s (Step 3: PROCESSING)
   * 3.0s: Motor shake begins
   * 3.5s - 5.5s: Paper emerges from slit onto catch tray
   * 6.0s: Motor settles, sheet ready on tray, triggers completion
   */
  const printPaper = useCallback(
    (customUrl) => {
      if (isPrintingRef.current) return;
      if (!paperGroupRef.current || !printerGroupRef.current) return;

      const urlToUse = customUrl || pdfUrl;
      if (urlToUse) {
        updatePaperTexture(urlToUse);
      }

      setIsPrinting(true);
      setIsPrinted(false);
      playSound('motor');
      if (onPrintStart) onPrintStart();

      const printer = printerGroupRef.current;
      const paperGroup = paperGroupRef.current;

      // Position paper inside the dispenser slot slit above bottom tray
      paperGroup.visible = true;
      paperGroup.position.set(SLOT_START_POS.x, SLOT_START_POS.y, SLOT_START_POS.z);
      paperGroup.rotation.set(-Math.PI / 2 - TRAY_SLANT, 0, 0);
      paperGroup.scale.set(0.01, 0.01, 0.01);

      // GSAP Timeline calibrated for 3.0s -> 6.0s overall flow
      const tl = gsap.timeline({
        onComplete: () => {
          setIsPrinting(false);
          setIsPrinted(true);
          setPrintCount((c) => c + 1);
          playSound('complete');
          if (onPrintComplete) onPrintComplete();
        },
      });

      // 1. Motor vibration (Shake for 2.4 seconds, 3.0s - 5.4s overall)
      tl.to(
        printer.position,
        {
          x: '+=0.014',
          y: '+=0.008',
          duration: 0.048,
          repeat: 48,
          yoyo: true,
          ease: 'sine.inOut',
        },
        0
      );

      // 2. Paper slides smoothly out of slit onto catch tray (3.5s - 5.5s overall)
      // Expand to full size as it emerges
      tl.to(
        paperGroup.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.45,
          ease: 'power1.out',
        },
        0.5 // t = 3.5s
      );

      // Slide along exact tray slant vector
      tl.to(
        paperGroup.position,
        {
          x: TRAY_END_POS.x,
          y: TRAY_END_POS.y,
          z: TRAY_END_POS.z,
          duration: 2.0, // 3.5s to 5.5s
          ease: 'power2.out',
        },
        0.5
      );

      tl.to(
        paperGroup.rotation,
        {
          x: -Math.PI / 2 - TRAY_SLANT,
          y: 0,
          z: 0,
          duration: 2.0,
          ease: 'power2.out',
        },
        0.5
      );

      // 3. Printer motor settles to exact rest origin (5.5s - 5.8s overall)
      tl.to(printer.position, { x: 0, y: 0, z: 0, duration: 0.3, ease: 'power1.out' }, 2.5);

      // 4. Brief settling pause until 3.0s mark (6.0s overall)
      tl.to({}, { duration: 0.2 }, 2.8);
    },
    [pdfUrl, updatePaperTexture, playSound, onPrintStart, onPrintComplete]
  );

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    printPaper,
    resetCamera: () => resetCamera(),
    isPrinting,
    isPrinted,
  }));

  /**
   * Reset 3D Camera view to default studio angle
   */
  const resetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    gsap.to(cameraRef.current.position, {
      x: 1.9,
      y: 1.8,
      z: 2.4,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        if (controlsRef.current) controlsRef.current.update();
      },
    });
    controlsRef.current.target.set(0, -0.1, 0.2);
  }, []);

  /**
   * Initialize Three.js Scene, Lighting, Controls, 2-Sided Mesh, and GLTF Model
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera framed on printer and tray
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    camera.position.set(1.9, 1.8, 2.4);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.outline = 'none';
    renderer.domElement.style.cursor = 'grab';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.8;
    controls.maxDistance = 7.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.target.set(0, -0.1, 0.2);
    controlsRef.current = controls;

    // 5. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.8);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdcecfe, 0.85);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.7);
    rimLight.position.set(0, 6, 0);
    scene.add(rimLight);

    // 6. Root Printer Group
    const printerGroup = new THREE.Group();
    scene.add(printerGroup);
    printerGroupRef.current = printerGroup;

    // 7. 2-Sided Paper Mesh Architecture:
    // Create paperGroup containing two coplanar back-to-back planes
    const frontCanvas = document.createElement('canvas');
    const backCanvas = document.createElement('canvas');
    frontCanvasRef.current = frontCanvas;
    backCanvasRef.current = backCanvas;

    drawBrandedDocument(frontCanvas, fileName, orderId, pages, colorMode);
    drawBrandedBackDocument(backCanvas, fileName, orderId, pages, colorMode);

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.colorSpace = THREE.SRGBColorSpace;
    frontTextureRef.current = frontTexture;

    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.colorSpace = THREE.SRGBColorSpace;
    backTextureRef.current = backTexture;

    const paperGroup = new THREE.Group();
    paperGroup.name = 'paperGroup';

    // Front mesh (Page 1) - Faces upward/forward
    const frontGeo = new THREE.PlaneGeometry(PAPER_WIDTH, PAPER_HEIGHT);
    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.35,
      metalness: 0.04,
      side: THREE.FrontSide,
    });
    const frontMesh = new THREE.Mesh(frontGeo, frontMat);
    frontMesh.position.z = 0.0005; // Slight offset to eliminate z-fighting
    frontMesh.castShadow = true;
    frontMesh.receiveShadow = true;
    paperGroup.add(frontMesh);

    // Back mesh (Page 2) - Faces downward/underside (rotated 180° on Y)
    const backGeo = new THREE.PlaneGeometry(PAPER_WIDTH, PAPER_HEIGHT);
    const backMat = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.35,
      metalness: 0.04,
      side: THREE.FrontSide,
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -0.0005;
    backMesh.rotation.y = Math.PI; // Inverted so Page 2 is upright when looking from below
    backMesh.castShadow = true;
    backMesh.receiveShadow = true;
    paperGroup.add(backMesh);

    // Initial position based on order status:
    // If order is already ready/completed, place on tray. Otherwise tuck inside slot.
    const isInitiallyReady = orderStatus === 'ready' || orderStatus === 'completed';
    if (isInitiallyReady) {
      paperGroup.position.set(TRAY_END_POS.x, TRAY_END_POS.y, TRAY_END_POS.z);
      paperGroup.rotation.set(-Math.PI / 2 - TRAY_SLANT, 0, 0);
      paperGroup.scale.set(1, 1, 1);
      paperGroup.visible = true;
      setIsPrinted(true);
    } else {
      paperGroup.position.set(SLOT_START_POS.x, SLOT_START_POS.y, SLOT_START_POS.z);
      paperGroup.rotation.set(-Math.PI / 2 - TRAY_SLANT, 0, 0);
      paperGroup.scale.set(0.01, 0.01, 0.01);
      paperGroup.visible = false;
    }

    printerGroup.add(paperGroup);
    paperGroupRef.current = paperGroup;

    // 8. Load 3D GLTF Model (/printer.glb)
    const loader = new GLTFLoader();
    loader.load(
      '/printer.glb',
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 2.6 / maxDim;

        const modelWrapper = new THREE.Group();
        modelWrapper.add(model);
        modelWrapper.scale.setScalar(scaleFactor);
        modelWrapper.rotation.y = Math.PI; // Keypad & tray face forward

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = THREE.MathUtils.clamp(child.material.roughness || 0.5, 0.25, 0.7);
              child.material.metalness = Math.min(child.material.metalness || 0, 0.35);
            }
          }
        });

        printerGroup.add(modelWrapper);
        setModelLoading(false);

        if (autoPrint) {
          setTimeout(() => {
            printPaper(pdfUrl);
          }, 400);
        }
      },
      undefined,
      (err) => {
        console.error('Failed to load /printer.glb:', err);
        setModelLoading(false);
      }
    );

    // 9. Raycasting for hover and click-to-inspect
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!paperGroupRef.current || !isPrintedRef.current) {
        setIsHovered(false);
        return;
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(paperGroupRef.current.children, true);

      if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
        setIsHovered(true);
      } else {
        renderer.domElement.style.cursor = 'grab';
        setIsHovered(false);
      }
    };

    const handlePointerDown = (e) => {
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e) => {
      const dist = Math.hypot(
        e.clientX - pointerDownPosRef.current.x,
        e.clientY - pointerDownPosRef.current.y
      );
      if (dist > 6) return;

      if (!paperGroupRef.current || !isPrintedRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(paperGroupRef.current.children, true);

      if (intersects.length > 0) {
        setInspectModalOpen(true);
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // 10. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 11. Animation Loop
    let isRunning = true;
    const animate = () => {
      if (!isRunning) return;
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      isRunning = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Mount once

  // Sync document texture when pdfUrl changes
  useEffect(() => {
    if (pdfUrl) {
      updatePaperTexture(pdfUrl);
    }
  }, [pdfUrl, updatePaperTexture]);

  // Sync with external orderStatus changes
  useEffect(() => {
    if (orderStatus === 'processing' && !isPrinting && !isPrinted) {
      printPaper(pdfUrl);
    } else if (orderStatus === 'ready' || orderStatus === 'completed') {
      if (paperGroupRef.current && !isPrinting) {
        paperGroupRef.current.visible = true;
        paperGroupRef.current.position.set(TRAY_END_POS.x, TRAY_END_POS.y, TRAY_END_POS.z);
        paperGroupRef.current.scale.set(1, 1, 1);
        setIsPrinted(true);
      }
    } else if (orderStatus === 'placed' || orderStatus === 'accepted') {
      if (paperGroupRef.current && !isPrinting) {
        paperGroupRef.current.visible = false;
        paperGroupRef.current.position.set(SLOT_START_POS.x, SLOT_START_POS.y, SLOT_START_POS.z);
        paperGroupRef.current.scale.set(0.01, 0.01, 0.01);
        setIsPrinted(false);
      }
    }
  }, [orderStatus]);

  // Determine current badge style & text
  const isPrintingNow = isPrinting || orderStatus === 'processing';
  const isReadyNow = isPrinted || orderStatus === 'ready' || orderStatus === 'completed';
  const isAcceptedNow = orderStatus === 'accepted';

  return (
    <div
      className="neo-card"
      style={{
        padding: '0',
        overflow: 'hidden',
        background: '#FFFDF9',
        border: '3px solid #000',
        boxShadow: '4px 4px 0px #000',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header & Hardware Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '2px solid #000',
          background: '#FFD028',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Printer size={20} strokeWidth={2.5} />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.92rem',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Status Pill matching Step 1 -> Step 4 progression */}
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '999px',
              border: '2px solid #000',
              background: isPrintingNow
                ? '#FEF08A'
                : isReadyNow
                ? '#86EFAC'
                : isAcceptedNow
                ? '#BFDBFE'
                : '#FFFFFF',
              color: '#000',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '1px 1px 0px #000',
            }}
          >
            {isPrintingNow && <Loader2 size={12} className="spin" />}
            {isReadyNow && <CheckCircle size={12} color="#166534" />}
            {isPrintingNow
              ? 'PRINTING'
              : isReadyNow
              ? 'PRINT COMPLETE'
              : isAcceptedNow
              ? 'ACCEPTED · QUEUED'
              : 'STANDBY'}
          </span>

          {/* Reset Camera Button */}
          <button
            type="button"
            onClick={resetCamera}
            title="Reset 3D View"
            style={{
              background: '#FFFFFF',
              border: '2px solid #000',
              borderRadius: '6px',
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              boxShadow: '1px 1px 0px #000',
            }}
          >
            <RotateCcw size={13} />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: height,
          position: 'relative',
          background: 'radial-gradient(circle at center 40%, #FFFFFF 0%, #F5F1E6 100%)',
          userSelect: 'none',
        }}
      >
        {/* Loading Spinner */}
        {modelLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'rgba(255, 253, 249, 0.85)',
              zIndex: 10,
              backdropFilter: 'blur(2px)',
            }}
          >
            <Loader2 size={32} className="spin" color="#000" />
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.9rem',
              }}
            >
              Loading 3D Hardware Model…
            </div>
          </div>
        )}

        {/* Hover Hint for Click-to-Inspect */}
        {isReadyNow && isHovered && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              pointerEvents: 'none',
              zIndex: 15,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <Eye size={14} color="#FFD028" />
            <span>Click printed sheet to inspect document!</span>
          </div>
        )}

        {/* Subtle Bottom-Left Controls Overlay Hint */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '14px',
            background: 'rgba(255, 255, 255, 0.88)',
            border: '2px solid #000',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            color: '#333',
            pointerEvents: 'none',
            boxShadow: '2px 2px 0px #000',
          }}
        >
          🖱️ Drag to rotate 360° · Scroll to zoom
        </div>
      </div>

      {/* Bottom Action Footer */}
      {showControls && (
        <div
          style={{
            padding: '12px 16px',
            background: '#FFFFFF',
            borderTop: '2px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#DC2626" />
            <div style={{ fontSize: '0.84rem' }}>
              <span style={{ fontWeight: 800 }}>{fileName}</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                ({pages} {pages === 1 ? 'page' : 'pages'} · {colorMode.toUpperCase()})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Inspect Sheet Button */}
            <button
              type="button"
              className="neo-btn sm"
              disabled={!isReadyNow}
              onClick={() => setInspectModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                opacity: !isReadyNow ? 0.6 : 1,
              }}
            >
              <Eye size={15} />
              <span>Inspect Sheet</span>
            </button>

            {/* Print Trigger / Demo Progression Button */}
            <button
              type="button"
              className="neo-btn primary sm"
              disabled={isPrintingNow}
              onClick={() => {
                if (onTriggerDemo) {
                  onTriggerDemo();
                } else {
                  printPaper(pdfUrl);
                }
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {isPrintingNow ? (
                <>
                  <Loader2 size={15} className="spin" />
                  <span>Printing…</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>{isReadyNow ? 'Print Again' : 'Print Document'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Full-Screen PDF / 2-Sided Document Inspection Modal */}
      {inspectModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setInspectModalOpen(false)}
        >
          <div
            className="neo-card"
            style={{
              width: '100%',
              maxWidth: '850px',
              height: '90vh',
              maxHeight: '900px',
              background: '#FFFDF9',
              border: '3px solid #000',
              boxShadow: '6px 6px 0px #000',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Topbar */}
            <div
              style={{
                padding: '14px 20px',
                background: '#FFD028',
                borderBottom: '3px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={22} color="#000" />
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 900,
                      fontSize: '1.05rem',
                      margin: 0,
                    }}
                  >
                    {fileName}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#333', fontWeight: 600 }}>
                    Order #{orderId} · {pages} {pages === 1 ? 'page' : 'pages'} · 2-Sided Output Tray Inspection
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* View Mode Toggle: Physical Sheet vs PDF Document */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#000',
                    padding: '2px',
                    borderRadius: '6px',
                    gap: '2px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setModalTab('sheet')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-heading)',
                      border: 'none',
                      borderRadius: '4px',
                      background: modalTab === 'sheet' ? '#FFD028' : 'transparent',
                      color: modalTab === 'sheet' ? '#000' : '#FFF',
                      cursor: 'pointer',
                    }}
                  >
                    Physical Sheet
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('pdf')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-heading)',
                      border: 'none',
                      borderRadius: '4px',
                      background: modalTab === 'pdf' ? '#FFD028' : 'transparent',
                      color: modalTab === 'pdf' ? '#000' : '#FFF',
                      cursor: 'pointer',
                    }}
                  >
                    PDF Document
                  </button>
                </div>

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="neo-btn sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                      color: '#000',
                    }}
                  >
                    <ExternalLink size={14} />
                    <span>New Tab</span>
                  </a>
                )}
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    download={fileName}
                    className="neo-btn sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                      color: '#000',
                    }}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </a>
                )}
                <button
                  type="button"
                  className="neo-btn sm"
                  style={{ padding: '6px 8px' }}
                  onClick={() => setInspectModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Either PDF Iframe or 2-Sided Physical Sheet View */}
            <div
              style={{
                flex: 1,
                background: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'auto',
                position: 'relative',
              }}
            >
              {modalTab === 'pdf' && pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title="Document Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: '#FFFFFF',
                  }}
                />
              ) : (
                <div
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    background: '#1E293B',
                    overflow: 'auto',
                    gap: '16px',
                  }}
                >
                  {/* Duplex Face Toggle: Page 1 (Front) vs Page 2 (Back) */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      padding: '4px',
                      gap: '6px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSheetSide('front')}
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        fontFamily: 'var(--font-heading)',
                        border: 'none',
                        borderRadius: '6px',
                        background: sheetSide === 'front' ? '#FFD028' : 'transparent',
                        color: sheetSide === 'front' ? '#000' : '#FFF',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Layers size={14} />
                      <span>Page 1 (Top Face)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSheetSide('back')}
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        fontFamily: 'var(--font-heading)',
                        border: 'none',
                        borderRadius: '6px',
                        background: sheetSide === 'back' ? '#FFD028' : 'transparent',
                        color: sheetSide === 'back' ? '#000' : '#FFF',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Layers size={14} />
                      <span>Page 2 (Underside / Duplex)</span>
                    </button>
                  </div>

                  {/* Rendered Canvas Texture Output */}
                  {((sheetSide === 'front' ? frontCanvasRef.current : backCanvasRef.current) || frontCanvasRef.current) ? (
                    <div style={{ textAlign: 'center' }}>
                      <img
                        src={(
                          sheetSide === 'front'
                            ? frontCanvasRef.current?.toDataURL()
                            : backCanvasRef.current?.toDataURL()
                        ) || frontCanvasRef.current?.toDataURL()}
                        alt={`Printed Sheet ${sheetSide === 'front' ? 'Page 1' : 'Page 2'}`}
                        style={{
                          maxWidth: '460px',
                          width: '90%',
                          maxHeight: '65vh',
                          objectFit: 'contain',
                          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65)',
                          border: '3px solid #000',
                          background: '#FFFFFF',
                        }}
                      />
                      <div
                        style={{
                          marginTop: '10px',
                          color: '#94A3B8',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 700,
                        }}
                      >
                        {sheetSide === 'front'
                          ? 'Page 1 mapped to top face of 3D sheet mesh'
                          : 'Page 2 mapped to bottom face of 3D sheet mesh (Duplex Print)'}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="neo-card"
                      style={{
                        background: '#FFFFFF',
                        maxWidth: '520px',
                        width: '100%',
                        padding: '24px',
                        textAlign: 'left',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '2px solid #000',
                          paddingBottom: '12px',
                          marginBottom: '16px',
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900 }}>
                          CAMPUS PRINT VERIFIED DOCUMENT
                        </span>
                        <span className="neo-badge paid">PRINT READY</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                        <strong>File:</strong> {fileName}
                      </div>
                      <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                        <strong>Job ID:</strong> {orderId}
                      </div>
                      <div style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
                        <strong>Specifications:</strong> {pages} pages, {colorMode.toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
