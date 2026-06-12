// Vercel Web Analytics initialization
// This script loads the @vercel/analytics package from CDN and initializes it

(function() {
  // Create script element to load the analytics module from CDN
  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = `
    import { inject } from 'https://cdn.jsdelivr.net/npm/@vercel/analytics@1/+esm';
    
    // Initialize Vercel Analytics
    inject({
      mode: 'auto',
      debug: false
    });
  `;
  
  // Append to head to ensure it loads early
  document.head.appendChild(script);
})();
