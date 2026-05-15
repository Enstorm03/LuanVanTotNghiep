const Footer = ({ brandName = "a" }) => {
  return (
    <footer className="bg-surface-light dark:bg-surface-dark mt-16 border-t border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-4 text-text-light dark:text-text-dark">
              <div className="text-primary text-2xl">
                <span className="material-symbols-outlined"></span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">{brandName}</h2>
            </div>
            <p className="mt-4 text-subtle-light dark:text-subtle-dark text-sm">Discover your signature scent with our curated collection of luxury perfumes.</p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li><a className="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors" href="/products">Women's</a></li>
              <li><a className="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors" href="/products">Men's</a></li>
              <li><a className="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors" href="/brands">Brands</a></li>
              <li><a className="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors" href="/products">New Arrivals</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">About</h3>
            <ul className="mt-4 space-y-2">
              <li><button className="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Our Story</button></li>
              <li><button className="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Contact Us</button></li>
              <li><button className="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors bg-transparent border-none cursor-pointer">FAQs</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><button className="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Shipping & Returns</button></li>
              <li><button className="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Privacy Policy</button></li>
              <li><button className="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border-light dark:border-border-dark pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-subtle-light dark:text-subtle-dark">© 2025 {brandName} . All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            {/* Social media icons would go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
