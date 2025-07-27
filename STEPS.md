# 📝 How to Update Your Resume Website

This guide will walk you through updating your resume website safely using GitHub's web interface. No technical knowledge required!

## 🎯 Overview

You'll learn to:
- Create a branch for your changes
- Edit your resume content files
- Submit changes for review
- Deploy updates to your live website
- Clean up after successful changes

## ⚠️ CRITICAL: Protected Branches

**🚨 NEVER touch these branches:**
- **`master`** - This is your main branch that controls your live website
- **`gh-pages`** - This is automatically managed by GitHub and contains your built website

**What this means:**
- ❌ Never edit files directly on `master` or `gh-pages`
- ❌ Never delete these branches
- ❌ Never make commits directly to these branches
- ✅ Always create a new branch for any changes
- ✅ Only merge to `master` through pull requests

**Why this matters:**
- Editing directly on `master` can break your live website
- Deleting these branches will destroy your website completely
- The `gh-pages` branch is automatically managed - touching it can cause deployment issues

## 📋 Before You Start

- Make sure you're logged into GitHub
- Have your new resume content ready
- Know which sections you want to update

---

## Step 1: Navigate to Your Repository 🌐

1. **Go to your website**: Visit [https://preetirameshparmar.github.io](https://preetirameshparmar.github.io)
   - This shows you the current version of your site
   - Note what you want to change

2. **Open your repository**: Go to [https://github.com/preetirameshparmar/preetirameshparmar.github.io](https://github.com/preetirameshparmar/preetirameshparmar.github.io)
   - This is where you'll make your changes
   - You should see all your project files here

---

## Step 2: Create a Branch and Make Changes 🌿

### Create a New Branch

1. **Click the branch dropdown** (shows "master" by default) at the top-left of the file list
2. **Type a new branch name** in the text box, such as:
   - `update-work-experience`
   - `add-new-project`
   - `fix-contact-info`
   - Use descriptive names that explain what you're changing
3. **Click "Create branch"** or press Enter

### Make Your Changes

1. **Navigate to the `public` folder** by clicking on it
2. **Choose the file you want to edit** (e.g., `personal.txt`, `work-experience.txt`)
3. **Click the pencil icon** (✏️) to edit the file

### Content Files Guide

**📁 personal.txt** - Your basic info
```
[Title]
Personal Information

[Content]
Name: Your Full Name
Phone: +1 234 567 8901
Email: your.email@example.com
Quote: Your professional tagline
```

**📁 education.txt** - Your education background
```
[Title]
Education

[Order]
1

[Content]
Degree: Your Degree
Institution: School Name
City: City, Country
Start: 2020
End: 2024
```

**📁 work-experience.txt** - Your job history
```
[Title]
Work Experience

[Order]
2

[Content]
Start: Jan 2023
End: Present
City: City, State
Company Name: Your Company
On Field work: What you did at this job...

Start: Jun 2021
End: Dec 2022
City: Another City
Company Name: Previous Company
On Field work: What you did at this previous job...
```

**📁 projects.txt** - Your projects
```
[Title]
Projects

[Order]
3

[Content]
Name: Project Name
Tech Stack: Technologies used
Description: What the project does...

Name: Another Project
Tech Stack: Other technologies
Description: Another project description...
```

**📁 skills.txt** - Your skills
```
[Title]
Skills

[Order]
4

[Content]
Programming: JavaScript, Python, Java
Tools: Git, Docker, VS Code
Soft Skills: Leadership, Communication
```

**📁 web.txt** - Your social links
```
[Title]
Web Profiles

[Order]
5

[Content]
LinkedIn - https://linkedin.com/in/yourprofile
GitHub - https://github.com/yourusername
Portfolio - https://yourwebsite.com
```

### ⚠️ Important: Section Ordering

- Each section has an `[Order]` number
- **Lower numbers appear first** on your website
- **Don't use the same order number twice**
- Common order: Education(1) → Work(2) → Projects(3) → Skills(4) → Web(5)
- Personal info is always first regardless of order

### Save Your Changes

1. **Scroll down** to the "Commit changes" section
2. **Add a commit message** describing what you changed:
   - ✅ "Update work experience with new job"
   - ✅ "Add new project to portfolio"
   - ✅ "Fix phone number in contact info"
3. **Select "Commit directly to the [your-branch-name] branch"**
4. **Click "Commit changes"**

### Repeat for Multiple Files

If you need to edit multiple files:
1. **Go back to the `public` folder**
2. **Edit the next file** following the same process
3. **Commit each change** with a descriptive message

---

## Step 3: Create Pull Request and Merge 🔄

### Create Pull Request

1. **You'll see a yellow banner** saying "Your branch had recent pushes"
2. **Click "Compare & pull request"**
   
   *If you don't see the banner:*
   - Click "Pull requests" tab
   - Click "New pull request"
   - Select your branch from the dropdown

3. **Fill out the pull request form:**
   - **Title**: Brief description (e.g., "Update resume with latest job")
   - **Description**: More details about what you changed
   ```
   ## Changes Made
   - Updated work experience with new position
   - Added two new projects
   - Updated skills section
   
   ## Testing
   - [x] Checked file formats are correct
   - [x] Verified no duplicate order numbers
   ```

4. **Click "Create pull request"**

### Review and Merge

1. **Wait for checks to complete** (green checkmarks ✅)
   - This ensures your changes won't break the website
   - If you see red X's, there's an error in your format

2. **Click "Squash and merge"** (very important!)
   - This combines all your commits into one clean commit
   - Keeps the project history clean

3. **Click "Confirm squash and merge"**

---

## Step 4: Verify Build and Clean Up 🧹

### Check the Build

1. **Go to the "Actions" tab** in your repository
2. **Look for the latest workflow run** (should be running or completed)
3. **Wait for green checkmark** ✅ 
   - This means your website is being updated
   - Usually takes 2-5 minutes

### Delete Your Branch

1. **You'll see a purple "Delete branch" button** after merging
2. **Click "Delete branch"**
   - This keeps your repository clean
   - You can always create new branches for future changes
   - ⚠️ **ONLY delete the branch you just created** - never delete `master` or `gh-pages`

**🔒 Protected Branches Reminder:**
- You should see your feature branch name (like "update-work-experience") in the delete button
- If you ever see options to delete `master` or `gh-pages`, **DO NOT click them**
- Only delete branches that you personally created for your changes

---

## Step 5: Verify Your Changes on the Website 🌐

### Check Your Live Website

1. **Wait 5-10 minutes** after the build completes
2. **Visit your website**: [https://preetirameshparmar.github.io](https://preetirameshparmar.github.io)
3. **Refresh the page** (Ctrl+F5 or Cmd+Shift+R) to see changes
4. **Verify all your updates** appear correctly

### If Changes Don't Appear

- **Wait a bit longer** - GitHub Pages can take up to 10 minutes
- **Clear your browser cache** and refresh
- **Check in incognito/private window**
- **Verify the build completed successfully** in the Actions tab

---

## 🛠️ Troubleshooting

### ❌ Build Failed (Red X)

**Most common issues:**
- **Missing `[Title]` or `[Content]` sections** in your files
- **Incorrect file format** - make sure you follow the examples exactly
- **Special characters** causing parsing errors

**How to fix:**
1. Go back to your branch
2. Edit the problematic file
3. Fix the format issue
4. Commit the fix
5. The pull request will automatically update

### ❌ Content Not Loading on Website

**Check your file format:**
```
[Title]
Section Name

[Order]
1

[Content]
Your content here...
```

**Common mistakes:**
- Missing blank line after `[Title]`
- Wrong bracket types (use `[` and `]`)
- Missing `[Content]` section

### ❌ Sections in Wrong Order

- **Check your `[Order]` numbers**
- **Make sure no two sections have the same order**
- **Lower numbers = appear first**

---

## 📚 Quick Reference

| File | What It Controls | Order Example |
|------|------------------|---------------|
| `personal.txt` | Name, contact, bio | Always first |
| `education.txt` | Degrees, schools | 1 |
| `work-experience.txt` | Jobs, experience | 2 |
| `projects.txt` | Portfolio projects | 3 |
| `skills.txt` | Technical skills | 4 |
| `web.txt` | Social media links | 5 |

## 🎯 Best Practices

### ✅ Do This
- Always create a new branch for changes
- Use descriptive branch and commit messages
- Always "Squash and merge" pull requests
- Delete branches after merging (except `master` and `gh-pages`)
- Test changes by viewing your live website
- Keep order numbers unique and sequential
- Only work on branches you created yourself

### ❌ Avoid This
- **🚨 NEVER edit, delete, or touch the `master` or `gh-pages` branches directly**
- Don't edit files directly on the master branch
- Don't use the same order number for multiple sections
- Don't forget to delete merged branches (except protected ones)
- Don't merge until the build is green ✅
- Don't use special characters that might break parsing
- Don't work directly on any branch that isn't your own feature branch

---

## 🆘 Need Help?

If you run into issues:

1. **Check the format** of your text files against the examples
2. **Look at the Actions tab** for build error details
3. **Compare your files** with the working examples in this guide
4. **Start over** with a new branch if needed

**🚨 If You Accidentally Touch Protected Branches:**
- **DO NOT PANIC** - contact someone technical immediately
- Don't try to "fix" it yourself
- Don't make more changes
- The website might be temporarily broken, but it can be restored

**Emergency Contacts:**
- If you accidentally edit/delete `master` or `gh-pages`
- If the website stops working after your changes
- If you see error messages you don't understand

Remember: You can always create a new branch and try again! The website won't break as long as you:
- Never touch `master` or `gh-pages` directly
- Don't merge failing builds
- Follow the branch-based workflow described above

---

**Happy updating! 🚀**

*Your changes will be live at [https://preetirameshparmar.github.io](https://preetirameshparmar.github.io) within 10 minutes of a successful merge.*