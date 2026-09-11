#!/usr/bin/env bash
set -e

REGION="ap-south-1"
USERS_TABLE="campusprint_users"
ORDERS_TABLE="campusprint_orders"

echo "Provisioning DynamoDB tables in ${REGION}..."

# Create Users Table
echo "1. Creating ${USERS_TABLE}..."
aws dynamodb create-table \
  --table-name "${USERS_TABLE}" \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "${REGION}" || echo "Table ${USERS_TABLE} may already exist or pending creation."

# Create Orders Table
echo "2. Creating ${ORDERS_TABLE}..."
aws dynamodb create-table \
  --table-name "${ORDERS_TABLE}" \
  --attribute-definitions AttributeName=orderId,AttributeType=S \
  --key-schema AttributeName=orderId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "${REGION}" || echo "Table ${ORDERS_TABLE} may already exist or pending creation."

echo "Waiting for tables to become active..."
aws dynamodb wait table-exists --table-name "${USERS_TABLE}" --region "${REGION}" || true
aws dynamodb wait table-exists --table-name "${ORDERS_TABLE}" --region "${REGION}" || true

echo "DynamoDB tables are ready!"
