---
title: "MPC Protocol Basics"
description: "Fundamental concepts of multi-party computation protocols"
nav_order: 1
---

# MPC Protocol Basics

Multi-Party Computation (MPC) is a cryptographic technique that enables multiple parties to compute a joint function over their inputs while keeping those inputs private.

## Key Concepts

### Privacy Preservation
- Input privacy: Individual inputs remain secret
- Output correctness: The computed result is accurate
- Security against malicious adversaries

### Protocol Types
- **Semi-honest model**: Parties follow the protocol but try to learn extra information
- **Malicious model**: Parties may deviate arbitrarily from the protocol
- **Covert model**: Parties may deviate but prefer not to be caught

## Security Guarantees

MPC protocols provide several important security properties:

1. **Correctness**: The output of the protocol equals the output of the ideal functionality
2. **Privacy**: No party learns more than what can be inferred from their input and output
3. **Robustness**: The protocol completes successfully even if some parties behave maliciously

## Common Applications

- Private set intersection
- Secure auctions
- Privacy-preserving machine learning
- Threshold cryptography