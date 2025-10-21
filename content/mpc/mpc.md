# Secure Multi-Party Computation: From Theory to Practice

Imagine figuring out who earns the most among friends without revealing actual salaries. Or banks detecting fraud patterns across their combined data while keeping records private. This is **Secure Multi-Party Computation (MPC)**: enabling mutually distrusting parties to jointly compute functions over private inputs, without revealing anything beyond the output.

For decades this was mostly theoretical. Today, MPC powers real applications: privacy-preserving auctions, secure key management, collaborative machine learning.

## The Foundations: Secret Sharing and Garbled Circuits

MPC research started in the 1980s with two groundbreaking approaches.

**Shamir's Secret Sharing** (1979) showed how to split a secret $s$ into $n$ shares where any $k$ shares reconstruct $s$, but $k-1$ reveal nothing. This laid groundwork for secret-shared MPC protocols where parties hold shares of values and jointly compute over them.

**Yao's Garbled Circuits** (1986) gave the first practical two-party computation protocol. One party encrypts a boolean circuit gate-by-gate, the other evaluates it using **Oblivious Transfer (OT)** to get decryption keys. Elegant but expensive—every gate needed multiple ciphertexts. For decades, mostly theoretical.

## The Efficiency Revolution: OT Extension

The breakthrough came in 2003 with **OT Extension** (Ishai et al.): use a few expensive "base OTs" (public-key crypto) to generate millions of cheap OTs using only symmetric operations. This changed everything.

Building on this:

- **GMW** (1987): Evaluate boolean circuits securely - AND gates via OT, XOR gates locally
- **SPDZ** (2012): Authenticated secret sharing with information-theoretic MACs
- **TinyOT** and variants: Correlated OT for efficient authenticated shares

Better OT leads to better MPC.

## From Binary to Arithmetic: OLE and VOLE

OT works for binary choices, but what about arithmetic over larger fields?

**Oblivious Linear Evaluation (OLE)** lets parties compute affine functions: one holds $(w,m)$, the other holds $\Delta$, establishing $k = w \cdot \Delta + m$ without revealing inputs.

Running many OLEs in parallel with the same $\Delta$ gives **Vector OLE (VOLE)**—the arithmetic analogue of OT extension. VOLE unlocks homomorphic properties: commitments can be added, multiplied by constants, and verified without revealing values. It's an information-theoretic MAC over finite fields.

VOLE commitments are **binding** (can't change values), **hiding** (verifier learns nothing), and **homomorphic** (compute algebraically). Perfect for verifiable computation.

## Modern Constructions: Quicksilver

**Quicksilver** (2021) is a ZK proof system over boolean circuits using VOLE-based commitments.

Unlike SNARKs/STARKs (arithmetic circuits, heavy crypto), Quicksilver uses simple primitives: OT extension, VOLE, GGM trees. The prover commits to wire values, proves AND gates, verifier handles XOR gates via homomorphism.

Result: extremely fast provers, low communication - ideal for bandwidth-sensitive and large scale MPC.

## Why It Matters

MPC is no longer just theory. Libraries like [mpz](https://github.com/privacy-scaling-explorations/mpz), [MP-SPDZ](https://github.com/data61/MP-SPDZ), and [EMP-toolkit](https://github.com/emp-toolkit) are used in production.

The progression:

- **1980s**: Foundations (secret sharing, garbled circuits, GMW)
- **2000s**: OT extension makes it practical
- **2010s**: Authenticated shares (SPDZ), correlated OT, OLE/VOLE
- **2020s**: VOLE-based ZK (Quicksilver, Mac'n'Cheese), post-quantum MPC

Each generation builds on the last. If you're building privacy-preserving systems, these primitives are essential.
