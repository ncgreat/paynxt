import { motion } from 'framer-motion';
import { RiCheckboxCircleFill, RiCloseCircleFill } from 'react-icons/ri';

import './transactions.css';
const Transactions = ({ user }) => {
	return (
		<div className="super__feature">
			<div className="super__transactions-content">
				<div>
					<motion.div
						initial="hidden"
						whileInView="visible"
						transition={{ duration: 1.5 }}
						variants={{
							visible: { opacity: 1, translateX: 0 },
							hidden: { opacity: 0, translateX: 200 },
						}}
					>
						<h3>Recent Transactions</h3>
					</motion.div>
				</div>
			</div>
			<div>
				<motion.div
					initial="hidden"
					whileInView="visible"
					transition={{ duration: 0.8 }}
					variants={{
						visible: { opacity: 1 },
						hidden: { opacity: 0 },
					}}
					className="super__transactions"
				>
					<table className="styled-table">
						<thead>
							<tr>
								<th width="8%"></th>
								<th>Service</th>
								<th>Amount</th>
								<th>Transaction ID</th>
								<th>Status</th>
							</tr>
						</thead>
						{user.transaction ? (
							<tbody>
								<tr>
									<td>
										<RiCheckboxCircleFill
											size={16}
											className="transaction__icon-success"
										/>
									</td>
									<td>
										<div className="table-col">
											<span className="text-bold">Airtime</span>
											<span>08024776152</span>
										</div>
									</td>

									<td>
										<div className="table-col">
											<span className="text-bold">6000</span>
											<span>NGN</span>
										</div>
									</td>
									<td>TR56146876497050CB</td>
									<td>
										<div className="table-col">
											<span className="text-bold">Completed</span>
											<span>16th June, 2023, 10:55AM</span>
										</div>
									</td>
								</tr>
								<tr className="active-row">
									<td>
										<RiCloseCircleFill
											size={16}
											className="transaction__icon-failed"
										/>
									</td>
									<td>
										<div className="table-col">
											<span className="text-bold">Data</span>
											<span>08036389956</span>
										</div>
									</td>

									<td>
										<div className="table-col">
											<span className="text-bold">2500</span>
											<span>NGN</span>
										</div>
									</td>
									<td>TR46413874654533PZ</td>
									<td>
										<div className="table-col">
											<span className="text-bold">Failed</span>
											<span>14th June, 2023, 12:14AM</span>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<RiCheckboxCircleFill
											size={16}
											className="transaction__icon-success"
										/>
									</td>
									<td>
										<div className="table-col">
											<span className="text-bold">Airtime</span>
											<span>08044735524</span>
										</div>
									</td>
									<td>
										<div className="table-col">
											<span className="text-bold">500</span>
											<span>NGN</span>
										</div>
									</td>
									<td>TR56465798787686SX</td>
									<td>
										<div className="table-col">
											<span className="text-bold">Completed</span>
											<span>17th June, 2023, 08:25AM</span>
										</div>
									</td>
								</tr>
							</tbody>
						) : (
							<tbody>
								<tr>
									<td colSpan="5" className="text-center">
										<span className="w-full p-5">No Transactions</span>
									</td>
								</tr>
							</tbody>
						)}
					</table>
				</motion.div>
			</div>
		</div>
	);
};

export default Transactions;
