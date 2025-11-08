# 🔒 Environment Security Guide

## Important: Protecting Your API Keys

Your `.env` file contains sensitive information like API keys. **Never commit this file to git!**

### ✅ What's Protected

- `.env` file is in `.gitignore`
- API keys and secrets are kept local
- Environment variables are loaded securely

### 🛡️ Security Best Practices

1. **Never share your `.env` file**
2. **Use different API keys for different environments**
3. **Rotate API keys regularly**
4. **Use `.env.example` as a template for team members**

### 🔧 Setting Up Environment

1. Copy the example file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your real API keys:

   ```bash
   # Edit this file with your actual values
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Verify the file is ignored:
   ```bash
   git status
   # .env should NOT appear in the list
   ```

### 🚨 If You Accidentally Commit Secrets

If you accidentally commit your `.env` file:

1. **Remove it from git immediately:**

   ```bash
   git rm --cached .env
   git commit -m "Remove .env file"
   ```

2. **Rotate your API keys immediately**
3. **Update your `.env` with new keys**

### 📋 Environment Variables Used

- `GEMINI_API_KEY` - Google Gemini AI API key
- `HOST` - Server host (optional)
- `PORT` - Server port (optional)
- `DEBUG` - Debug mode (optional)

### 🔗 Getting API Keys

- **Gemini API**: https://aistudio.google.com/
