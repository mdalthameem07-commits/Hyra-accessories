const Footer = () => {
  return (
    <footer className="bg-espresso text-ivory mt-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="font-display text-2xl font-bold">HYRA Mobile</span>
          <p className="mt-3 text-sm text-ivory/70 leading-relaxed">
            Cases, glass, chargers, and gadgets built to keep up with your device.
          </p>
        </div>
        <div>
          <h4 className="eyebrow text-brassLight mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li>Mobile Covers</li>
            <li>Tempered Glass</li>
            <li>Chargers & Cables</li>
            <li>Earphones</li>
            <li>Smart Watches</li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow text-brassLight mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li>Shipping & Returns</li>
            <li>Track Order</li>
            <li>Contact Us</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow text-brassLight mb-4">Stay in Touch</h4>
          <p className="text-sm text-ivory/70 mb-3">Get early access to new drops.</p>
          <div className="flex border-b border-ivory/30">
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent text-sm py-2 flex-1 focus:outline-none placeholder:text-ivory/40"
            />
            <button className="text-xs uppercase tracking-widest2 text-brassLight">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10 text-center text-xs text-ivory/50 py-5">
        © {new Date().getFullYear()} HYRA Mobile Accessories. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
