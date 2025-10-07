# MelodyMakerAI Examples

This directory contains practical, end-to-end examples for building features in MelodyMakerAI.

## 📚 Available Examples

### 1. [Simple Music Generation](01-simple-generation.md)
Learn how to create a basic music generation feature with:
- Server Actions for backend logic
- Client components for forms
- Inngest event emission
- Toast notifications

**Complexity**: ⭐ Beginner  
**Time**: 15 minutes

---

### 2. [Audio Player](02-audio-player.md)
Build a global audio player with:
- Zustand for state management
- HTML5 Audio API
- Pre-signed URL generation
- Persistent playback across pages

**Complexity**: ⭐⭐ Intermediate  
**Time**: 30 minutes

---

### 3. [Inngest Background Jobs](03-inngest-background-job.md)
Master asynchronous processing with:
- Step-based execution
- Automatic retries
- Concurrency control
- Error handling
- Monitoring & debugging

**Complexity**: ⭐⭐⭐ Advanced  
**Time**: 45 minutes

---

## 🚀 Quick Start

Each example is self-contained and includes:
- ✅ Complete, copy-paste code
- ✅ Explanation of concepts
- ✅ Testing instructions
- ✅ Best practices

### How to Use These Examples

1. **Read the example file** (e.g., `01-simple-generation.md`)
2. **Copy the code** into your project
3. **Modify as needed** for your use case
4. **Test locally** following the instructions
5. **Deploy** to production

### Prerequisites

All examples assume you have:
- Node.js 18+ installed
- pnpm package manager
- Basic TypeScript knowledge
- MelodyMakerAI project cloned

---

## 💡 Learning Path

### For Beginners
Start with these examples in order:
1. Simple Music Generation
2. Audio Player

### For Intermediate Developers
Focus on:
2. Audio Player
3. Inngest Background Jobs

### For Advanced Developers
Deep dive into:
3. Inngest Background Jobs
- Then read [ARCHITECTURE.md](../ARCHITECTURE.md)

---

## 🎯 Example Structure

Each example follows this format:

```
# Example Title

## Overview
Brief description of what you'll build

## Code
Complete, working code snippets

## Explanation
Step-by-step walkthrough

## Testing
How to verify it works

## Best Practices
Tips and recommendations
```

---

## 🤝 Contributing Examples

Have a useful example to share? We'd love to include it!

**Guidelines**:
1. Keep it focused (one feature per example)
2. Include complete, working code
3. Add testing instructions
4. Explain the "why", not just the "how"
5. Follow the existing format

**Submit via Pull Request**:
```bash
git checkout -b example/your-feature-name
# Add your example file
git commit -m "docs: add example for [feature]"
git push origin example/your-feature-name
# Open PR on GitHub
```

---

## 📖 Additional Resources

- [Main README](../README.md) - Project overview
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Technical deep dive
- [SETUP.md](../SETUP.md) - Setup and configuration
- [Frontend README](../frontend/README.md) - Frontend-specific docs

---

## 🐛 Troubleshooting

### Example Not Working?

1. **Check dependencies**: Run `pnpm install`
2. **Verify environment variables**: Check `.env` file
3. **Check database**: Run `npx prisma generate && npx prisma db push`
4. **Check logs**: Look for errors in terminal
5. **Ask for help**: Open an issue on GitHub

### Common Issues

**"Cannot find module"**
```bash
pnpm install
```

**TypeScript errors**
```bash
npx prisma generate
```

**Inngest not working**
```bash
npx inngest-cli@latest dev
```

---

## 📝 License

These examples are part of the MelodyMakerAI project and are licensed under MIT.

---

**Happy Coding! 🎵**
