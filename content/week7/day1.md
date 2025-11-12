# Week 7: Day 1 - Build Tools & Webpack

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Weeks 1-6

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Understand bundlers and build tools
- ✅ Configure Webpack basics
- ✅ Create production builds
- ✅ Optimize bundle size
- ✅ Use code splitting

---

## 1️⃣ Why Build Tools?

### Problems Without Build Tools

```javascript
// Problem 1: Multiple files mess
<script src="app.js"></script>
<script src="utils.js"></script>
<script src="api.js"></script>
<script src="helpers.js"></script>
// Hard to manage dependencies!

// Problem 2: No minification
// app.js is 50KB uncompressed
// Slows down users

// Problem 3: No tree shaking
// Include code you don't use

// Problem 4: Browser compatibility
// Need to transpile modern JS to older JS
```

### Solution: Build Tools

Build tools:
1. **Bundle** all files into one (or few) files
2. **Minify** code to reduce size
3. **Tree shake** - remove unused code
4. **Transpile** - convert ES6+ to ES5
5. **Optimize** images, CSS, etc

---

## 2️⃣ Webpack Basics

### Installation

```bash
npm install --save-dev webpack webpack-cli
npm install --save-dev webpack-dev-server
```

### Basic Configuration

Create `webpack.config.js`:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry point - where to start bundling
  entry: './src/index.js',

  // Output - where to put the bundle
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true  // Clean dist folder before build
  },

  // Development vs Production
  mode: 'development',  // or 'production'

  // Loaders - how to handle different file types
  module: {
    rules: [
      {
        // Handle JavaScript
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        // Handle CSS
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        // Handle images
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource'
      }
    ]
  },

  // Plugins - additional processing
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],

  // Development server
  devServer: {
    static: './dist',
    port: 8080,
    hot: true
  },

  // Source maps for debugging
  devtool: 'source-map'
};
```

### Project Structure

```
my-app/
├── src/
│   ├── index.js
│   ├── components/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── styles/
│   │   └── main.css
│   └── index.html
├── dist/          (generated)
├── package.json
└── webpack.config.js
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "analyze": "webpack-bundle-analyzer dist/stats.json"
  }
}
```

---

## 3️⃣ Creating Bundles

### Development vs Production Build

```javascript
// webpack.config.js - conditional config
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'  // Hash for cache busting
  },
  module: {
    rules: [/* ... */]
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
    config.devServer = {
      hot: true,
      port: 8080
    };
  }

  if (argv.mode === 'production') {
    config.optimization = {
      minimize: true,
      usedExports: true  // Tree shaking
    };
  }

  return config;
};
```

### Running Builds

```bash
# Development - fast, with source maps
npm run dev

# Production - optimized, minified
npm run build

# Output
dist/
├── index.html
├── main.abc123.js
└── main.abc123.js.map
```

---

## 4️⃣ Code Splitting

### Manual Code Splitting

```javascript
// webpack.config.js
module.exports = {
  entry: {
    main: './src/index.js',
    about: './src/about.js',
    admin: './src/admin.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  }
};

// Output
dist/
├── main.bundle.js
├── about.bundle.js
└── admin.bundle.js
```

### Dynamic Code Splitting

```javascript
// Load code only when needed
async function loadFeature() {
  const module = await import('./heavy-feature.js');
  module.run();
}

// Or in React
const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### SplitChunksPlugin

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Separate node_modules into vendors.js
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        // Common code in common.js
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
};

// Output
dist/
├── vendors.js      (all node_modules)
├── common.js       (shared code)
└── main.js
```

---

## 5️⃣ Optimization Techniques

### Asset Optimization

```javascript
// Image compression
npm install --save-dev image-webpack-loader

// webpack.config.js
{
  test: /\.(png|jpg|gif)$/,
  use: [
    'file-loader',
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: { progressive: true, quality: 65 },
        optipng: { enabled: false }
      }
    }
  ]
}
```

### CSS Extraction

```javascript
npm install --save-dev mini-css-extract-plugin

// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css'
    })
  ]
};
```

### Analyzing Bundle Size

```bash
npm install --save-dev webpack-bundle-analyzer

# In webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

plugins: [
  new BundleAnalyzerPlugin()
]

# Then run build - opens interactive chart showing what's in bundle!
```

---

## 🎯 Common Build Issues

### Issue 1: Bundle Too Large
```javascript
// Solution: Code splitting + lazy loading
const Component = lazy(() => import('./Component'));
```

### Issue 2: Slow Build Time
```javascript
// Solution: Cache loaders
use: {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true
  }
}
```

### Issue 3: Source Maps Too Large
```javascript
// Development: use source-map
// Production: use source-map for debugging, remove later
devtool: process.env.NODE_ENV === 'production' ? false : 'source-map'
```

---

## 📝 Practice Exercises

### Exercise 1: Basic Webpack Setup
Create a webpack config that:
- Entry: src/index.js
- Output: dist/main.js
- Handles CSS and images
- Has dev server on port 8080

### Exercise 2: Code Splitting
Split your app into:
- main chunk
- vendor chunk (node_modules)
- common chunk (shared code)

### Exercise 3: Production Build
Create optimized production build:
- Minified JavaScript
- Extracted CSS
- Image optimization
- Hash filenames

### Exercise 4: Bundle Analysis
Analyze your bundle:
- Identify largest dependencies
- Find opportunities to reduce size
- Remove unused packages

---

## ✅ Summary

- **Build tools bundle and optimize** your application
- **Webpack is powerful** but can be complex
- **Code splitting** loads code when needed
- **Production builds** are much smaller than development
- **Analyze bundles** to find optimization opportunities

---

## 🔗 Next Steps

**Tomorrow (Day 2):** Environment Configuration & Variables  
**This Week:** Deploy your first application!

```jsx
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserDetail() {
  const { id } = useParams();
  return <h1>User {id}</h1>;
}
```

## ✅ Checkpoint

- [ ] Can set up React Router
- [ ] Can create routes
- [ ] Can use Link for navigation
- [ ] Can get route parameters

**Next:** Advanced Routing! 🚀

