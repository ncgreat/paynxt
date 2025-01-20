import { useLocation } from 'react-router-dom';

const Confirm = () => {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const paymentReference = searchParams.get('paymentReference');

	return (
		<div>
			<h1>Confirm Transaction</h1>
			<p>Payment Reference: {paymentReference}</p>
		</div>
	);
};

export default Confirm;
