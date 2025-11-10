# Deploy Script for GitHub Pages

# This script should be run from the Lablab repository root

# Step 1: Navigate to the love directory
cd love

# Step 2: Install dependencies (if needed)
npm install

# Step 3: Build the project
npm run build

# Step 4: The output will be in love/out directory
echo "Build complete! The static files are in love/out/"
echo ""
echo "To deploy to GitHub Pages:"
echo "1. Go to https://github.com/ZanjiDiaz/Lablab/settings/pages"
echo "2. Set Source to 'GitHub Actions'"
echo "3. Push this repository to GitHub"
echo "4. The GitHub Actions workflow will automatically deploy"
