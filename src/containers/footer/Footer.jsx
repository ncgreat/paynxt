import { Link } from 'react-router-dom';
import './footer.css';
const Footer = () => {
	return (
		<>
			<div className="super__footer">
				<div className="footer_content">
					<h2>Company</h2>
					<ul>
						<li>
							<Link to="/about-us">About Us</Link>
						</li>
						<li>
							<Link to="/contact-us">Contact Us</Link>
						</li>
						<li>
							<Link to="/integrate">Integrate Our API</Link>
						</li>
					</ul>
				</div>
				<div className="footer_content second">
					<h2>Product</h2>
					<ul>
						<li>
							<Link to="/faq">FAQ</Link>
						</li>
						<li>
							<Link to="/get-help">Help</Link>
						</li>
						<li>
							<Link to="/blog">Blog</Link>
						</li>
					</ul>
				</div>
				<div className="footer_content ">
					<h2>Legal</h2>
					<ul>
						<li>
							<Link to="/privacy-policy">Privacy Policy</Link>
						</li>
						<li>
							<Link to="/terms">Terms & Conditions</Link>
						</li>
						<li>
							<Link to="/disclaimer">Disclaimer</Link>
						</li>
						<li>
							<Link to="/affiliate">Affiliate Programme</Link>
						</li>
					</ul>
				</div>
				<div className="footer_content newsletter">
					<h2>Get latest update with our newsletter</h2>
					<input
						type="text"
						className="subscribe"
						placeholder="Enter your email"
					/>
					<div>
						<button type="button" className="subscribebtn">
							Subscribe
						</button>
					</div>
				</div>
			</div>
			<div className="copy">
				<p>&copy; 2025 Paynxt. All rights reserved.</p>
			</div>
		</>
	);
};
export default Footer;
