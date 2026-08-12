import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-lg mx-auto px-5 py-32 text-center">
    <span className="font-display text-6xl text-brass">404</span>
    <h1 className="section-heading mt-4">Page Not Found</h1>
    <p className="text-slateink/60 mt-3 mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
