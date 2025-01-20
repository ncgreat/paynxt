import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { LuCreditCard, LuHeadphones } from 'react-icons/lu';
// import { BsPhoneFill } from 'react-icons/bs';
import {
	MdPhoneAndroid,
	MdElectricBolt,
	MdScreenshotMonitor,
	MdSmartphone,
} from 'react-icons/md';
import { IoTicketOutline } from 'react-icons/io5';
import './actions.css';
import { useEffect, useState } from 'react';
const Actions = () => {
	const [isAirtime, setIsAirtime] = useState(false);
	const [isData, setIsData] = useState(false);
	const [isCable, setIsCable] = useState(false);
	const [isBetting, setIsBetting] = useState(false);
	const [isElectricity, setIsElectricity] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const buy_airtime = () => {
		setIsModalOpen(true);
		setIsAirtime(true);
	};

	const buy_data = () => {
		setIsModalOpen(true);
		setIsData(true);
	};

	const buy_cable = () => {
		setIsModalOpen(true);
		setIsCable(true);
	};

	const buy_betting = () => {
		setIsModalOpen(true);
		setIsBetting(true);
	};

	const buy_electricity = () => {
		setIsModalOpen(true);
		setIsElectricity(true);
	};

	useEffect(() => {
		if (isModalOpen === false) {
			setIsCable(false);
			setIsAirtime(false);
			setIsData(false);
			setIsElectricity(false);
			setIsBetting(false);
		}
	}, [isModalOpen]);

	const handleSelectChange = (event) => {
		// const selectedValue = event.target.value;
		// setShowAuto(selectedValue === 'auto');
		// setShowManual(selectedValue === 'manual');
	};

	return (
		<div className="super__feature">
			<div className="super__actions-content">
				<div>
					<motion.div
						initial="hidden"
						whileInView="visible"
						transition={{ duration: 1.5 }}
						variants={{
							visible: { opacity: 1, translateX: 0 },
							hidden: { opacity: 0, translateX: -200 },
						}}
					>
						<h3>Quick Actions</h3>
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
					className="super__actions"
				>
					<button onClick={buy_airtime}>
						<div className="featured_content">
							<MdSmartphone size={32} className="cta__icon" />
							<h2>Airtime</h2>
						</div>
					</button>
					<button onClick={buy_data}>
						<div className="featured_content">
							<MdPhoneAndroid size={32} className="cta__icon" />
							<h2>Data</h2>
						</div>
					</button>
					<button onClick={buy_cable}>
						<div className="featured_content">
							<MdScreenshotMonitor size={35} className="cta__icon" />
							<h2>CableTV</h2>
						</div>
					</button>
					<button onClick={buy_betting}>
						<div className="featured_content">
							<IoTicketOutline size={32} className="cta__icon" />
							<h2>Betting</h2>
						</div>
					</button>

					<button onClick={buy_electricity}>
						<div className="featured_content">
							<MdElectricBolt size={32} className="cta__icon" />
							<h2>Electricity</h2>
						</div>
					</button>
				</motion.div>
			</div>
			{isModalOpen && (
				<motion.div
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
						transition: {
							duration: 0.2,
						},
					}}
					className="fixed z-10 inset-0 overflow-y-auto backdrop-blur"
				>
					<motion.div
						initial={{
							scale: 0.5,
						}}
						animate={{ scale: 1, transition: { duration: 0.2 } }}
						className="flex items-center justify-center min-h-screen px-4"
					>
						<div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
						<div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
							<div className="flex bg-[#fafafa] px-4 py-3 sm:px-6 justify-between">
								<div className="flex items-center">
									{/* <img src={logo} alt="logo" className="w-12" /> */}
									<motion.div
										initial={{ x: 200, opacity: 0 }}
										animate={{
											x: 0,
											opacity: 1,
											transition: { duration: 0.2 },
										}}
										className=" w-full text-[#582066]"
									>
										<span className="font-bold drop-shadow">MegaDeals</span>{' '}
									</motion.div>
								</div>
								<button
									onClick={() => setIsModalOpen(false)}
									className="text-[#042326] hover:text-[#582066] transition ease-in-out duration-150 "
								>
									<svg
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
							<div className="px-4 py-5 sm:p-6">
								{isAirtime && (
									<div>
										<motion.div
											initial={{ x: -200, opacity: 0 }}
											animate={{
												x: 0,
												opacity: 1,
												transition: { duration: 0.2 },
											}}
											className=" w-full text-[#ddd]"
										>
											<span className="font-bold text-[#042326]">
												Purchase Airtime
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											<div className="flex flex-col">
												<select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Network....</option>
													<option value="auto">Airtel</option>
													<option value="manual">Glo</option>
													<option value="manual">MTN</option>
													<option value="manual">9Mobile</option>
													<option value="manual">Smile</option>
												</select>
												<input
													type="text"
													placeholder="Phone Number"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<input
													type="text"
													placeholder="Amount"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<h3 className="mb-2">Save Beneficiary</h3>
												{/* <label className="toggle mb-4 h-4 w-2">
													<input type="checkbox" />
													<span className="slider"></span>
												</label> */}
												<label className="toggle mb-4">
													<input type="checkbox" />
													<span className="slider"></span>
													<span
														className="labels"
														data-on="ON"
														data-off="OFF"
													></span>
												</label>
											</div>

											<button
												// onClick={saveAuto}
												type="button"
												className="text-white bg-[#582066] hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
											>
												Continue
											</button>
											<button
												onClick={() => setIsModalOpen(false)}
												type="button"
												className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												Cancel
											</button>
										</div>
									</div>
								)}

								{isData && (
									<div>
										<motion.div
											initial={{ x: -200, opacity: 0 }}
											animate={{
												x: 0,
												opacity: 1,
												transition: { duration: 0.2 },
											}}
											className=" w-full text-[#ddd]"
										>
											<span className="font-bold text-[#042326]">
												Purchase Data
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											<div className="flex flex-col">
												<select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Network....</option>
													<option value="auto">Airtel</option>
													<option value="manual">Glo</option>
													<option value="manual">MTN</option>
													<option value="manual">9Mobile</option>
													<option value="manual">Smile</option>
												</select>
												<input
													type="text"
													placeholder="Phone Number"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Plan....</option>
													<option value="auto">Airtel</option>
													<option value="manual">Daily</option>
													<option value="manual">Weekly</option>
													<option value="manual">Monthly</option>
												</select>
												<input
													type="text"
													placeholder="Amount"
													disabled
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<h3 className="mb-2">Save Beneficiary</h3>
												{/* <label className="toggle mb-4 h-4 w-2">
													<input type="checkbox" />
													<span className="slider"></span>
												</label> */}
												<label className="toggle mb-4">
													<input type="checkbox" />
													<span className="slider"></span>
													<span
														className="labels"
														data-on="ON"
														data-off="OFF"
													></span>
												</label>
											</div>

											<button
												// onClick={saveAuto}
												type="button"
												className="text-white bg-[#582066] hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
											>
												Continue
											</button>
											<button
												onClick={() => setIsModalOpen(false)}
												type="button"
												className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												Cancel
											</button>
										</div>
									</div>
								)}

								{isCable && (
									<div>
										<motion.div
											initial={{ x: -200, opacity: 0 }}
											animate={{
												x: 0,
												opacity: 1,
												transition: { duration: 0.2 },
											}}
											className=" w-full text-[#ddd]"
										>
											<span className="font-bold text-[#042326]">
												Cable TV Subscription
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											<div className="flex flex-col">
												<select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Biller....</option>
													<option value="auto">DSTV</option>
													<option value="manual">GoTV</option>
												</select>
												<input
													type="text"
													placeholder="Smart Card/IUC Number"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Package....</option>
												</select>
												<h3 className="mb-2">Save Smartcard/IUC</h3>
												{/* <label className="toggle mb-4 h-4 w-2">
													<input type="checkbox" />
													<span className="slider"></span>
												</label> */}
												<label className="toggle mb-4">
													<input type="checkbox" />
													<span className="slider"></span>
													<span
														className="labels"
														data-on="ON"
														data-off="OFF"
													></span>
												</label>
											</div>

											<button
												// onClick={saveAuto}
												type="button"
												className="text-white bg-[#582066] hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
											>
												Continue
											</button>
											<button
												onClick={() => setIsModalOpen(false)}
												type="button"
												className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												Cancel
											</button>
										</div>
									</div>
								)}

								{isBetting && (
									<div>
										<motion.div
											initial={{ x: -200, opacity: 0 }}
											animate={{
												x: 0,
												opacity: 1,
												transition: { duration: 0.2 },
											}}
											className=" w-full text-[#ddd]"
										>
											<span className="font-bold text-[#042326]">
												Bet Wallet
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											<div className="flex flex-col">
												<select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Biller....</option>
													<option value="auto">1XBET</option>
													<option value="manual">Bet9ja</option>
													<option value="manual">SportyBet</option>
													<option value="manual">Betway</option>
													<option value="manual">BetKing</option>
												</select>
												<input
													type="text"
													placeholder="Customer ID"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<input
													type="text"
													placeholder="Amount"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<h3 className="mb-2">Save Wallet ID</h3>
												{/* <label className="toggle mb-4 h-4 w-3">
													<input type="checkbox" />
													<span className="slider"></span>
												</label> */}
												<label className="toggle mb-4">
													<input type="checkbox" />
													<span className="slider"></span>
													<span
														className="labels"
														data-on="ON"
														data-off="OFF"
													></span>
												</label>
											</div>

											<button
												// onClick={saveAuto}
												type="button"
												className="text-white bg-[#582066] hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
											>
												Continue
											</button>
											<button
												onClick={() => setIsModalOpen(false)}
												type="button"
												className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												Cancel
											</button>
										</div>
									</div>
								)}

								{isElectricity && (
									<div>
										<motion.div
											initial={{ x: -200, opacity: 0 }}
											animate={{
												x: 0,
												opacity: 1,
												transition: { duration: 0.2 },
											}}
											className=" w-full text-[#ddd]"
										>
											<span className="font-bold text-[#042326]">
												Purchase Electricity
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											<div className="flex flex-col">
												<select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Biller....</option>
													<option value="manual">Abuja Electricity</option>
													<option value="manual">Benin Electricity</option>
													<option value="manual">Eko Electricity</option>
													<option value="manual">Ikeja Electricity</option>
													<option value="manual">Kaduna Electricity</option>
												</select>
												<input
													type="text"
													placeholder="Customer ID"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Tariff Plan....</option>
													<option value="auto">Prepaid</option>
													<option value="manual">Postpaid</option>
												</select>
												<input
													type="text"
													placeholder="Amount"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<h3 className="mb-2">Save Meter ID</h3>
												{/* <label className="toggle mb-4 h-4 w-2">
													<input type="checkbox" />
													<span className="slider"></span>
												</label> */}
												<label className="toggle mb-4">
													<input type="checkbox" />
													<span className="slider"></span>
													<span
														className="labels"
														data-on="ON"
														data-off="OFF"
													></span>
												</label>
											</div>

											<button
												// onClick={saveAuto}
												type="button"
												className="text-white bg-[#582066] hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
											>
												Continue
											</button>
											<button
												onClick={() => setIsModalOpen(false)}
												type="button"
												className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												Cancel
											</button>
										</div>
									</div>
								)}

								{/* {!apiResponse && (
									<div>
										<p>Loading...</p>
									</div>
								)} */}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
};

export default Actions;
