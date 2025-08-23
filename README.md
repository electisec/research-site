# Electisec Research Site

This is the official research website for Electisec, featuring comprehensive guides on smart contract security and cryptographic protocols.

## Features

- **Proxies Research**: Comprehensive guide to smart contract proxy patterns and security vulnerabilities
- **MPC Research**: Advanced research on multi-party computation protocols and cryptographic security
- **Category-based Content Management**: Organized content structure with markdown support
- **Responsive Design**: Modern, mobile-friendly interface
- **Search Functionality**: Full-text search across all research content

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Content Structure

```
content/
├── proxies/          # Smart contract proxy research
│   ├── home.md
│   ├── proxy-basics.md
│   └── ...
└── mpc/              # Multi-party computation research
    ├── home.md
    ├── protocol-basics.md
    └── ...
```

## Adding a New Research Category

The site architecture is designed to easily support new research categories. Follow these steps to add a new category (e.g., "cryptography"):

### Step 1: Update Categories Configuration

Edit `lib/categories.json` and add your new category:

```json
{
  "categories": {
    "proxies": { ... },
    "mpc": { ... },
    "cryptography": {
      "title": "Electisec Cryptography Research",
      "description": "Advanced research on cryptographic protocols and security analysis",
      "component": "ContentSection",
      "contentSource": "markdown",
      "contentPath": "content/cryptography",
      "seo": {
        "title": "Electisec Cryptography Research | Advanced Cryptographic Protocols",
        "keywords": [
          "cryptography",
          "cryptographic protocols",
          "encryption",
          "security analysis",
          "Electisec"
        ],
        "baseUrl": "https://research.electisec.com/cryptography"
      }
    }
  }
}
```

### Step 2: Create Content Directory

Create the content directory structure:

```bash
mkdir content/cryptography
```

### Step 3: Add Content Files

Create your research content as markdown files in the new directory. **Always include a `home.md` file** as the landing page:

```bash
# Required: Landing page
touch content/cryptography/home.md

# Add your research topics
touch content/cryptography/symmetric-encryption.md
touch content/cryptography/hash-functions.md
touch content/cryptography/digital-signatures.md
```

### Step 4: Write Content

Each markdown file should include frontmatter metadata:

```markdown
---
title: "Cryptography Research Overview"
description: "Advanced research on cryptographic protocols and security"
nav_order: 1
---

# Cryptography Research Overview

Your content here...
```

### Step 5: Test Your New Category

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Visit your new category**:
   - Main page: `http://localhost:3000/cryptography`
   - Individual topics: `http://localhost:3000/cryptography/symmetric-encryption`

3. **Verify functionality**:
   - ✅ Navigation works
   - ✅ Search functionality
   - ✅ Content displays properly
   - ✅ Mobile responsive design

### Step 6: Build and Deploy

```bash
# Test production build
npm run build

# Deploy to your hosting platform
npm run start
```

Your new category will be automatically available at:
- `research.electisec.com/cryptography`
- `research.electisec.com/cryptography/[topic-slug]`

### Content Writing Guidelines

1. **File Naming**: Use kebab-case for filenames (`symmetric-encryption.md`)
2. **Frontmatter**: Always include `title`, `description`, and optionally `nav_order`
3. **Home Page**: Each category must have a `home.md` file
4. **Navigation Order**: Use `nav_order` to control sidebar ordering
5. **Links**: Use relative links between content files
6. **Images**: Store in `/public/assets/images/` and reference as `/assets/images/filename.jpg`

### Advanced Configuration

The categories configuration supports additional options:

```json
{
  "title": "Display Title",
  "description": "SEO description",
  "component": "ContentSection",
  "contentSource": "markdown",
  "contentPath": "content/category-name",
  "seo": {
    "title": "Full SEO title",
    "keywords": ["keyword1", "keyword2"],
    "baseUrl": "https://research.electisec.com/category-name"
  }
}
```

That's it! The generalized architecture handles all the routing, navigation, search functionality, and responsive design automatically.

## Deployment

This site is designed to be deployed at `research.electisec.com` with:
- Proxies section at: `research.electisec.com/proxies`
- MPC section at: `research.electisec.com/mpc`

## Contributing

For questions, feedback, or contributions, please contact [Electisec](https://electisec.com).
