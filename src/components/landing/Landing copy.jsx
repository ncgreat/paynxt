import { useHistory } from 'react-router-dom';
import {
	Footer,
	Header,
	Navbar,
	Partners,
	Feature,
	CTA,
} from '../../containers';
import { useEffect } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Landing = () => {
	const user =
		localStorage.getItem('loggedUser') !== 'undefined'
			? JSON.parse(localStorage.getItem('loggedUser'))
			: localStorage.clear();
	const navigate = useHistory();
	useEffect(() => {
		if (user) {
			navigate.push('/dashboard', { replace: true });
		}
	}, [user]);

	const particlesInit = async (main) => {
		await loadFull(main);
	  };

	return (
		<div className="">
			<div className="bg-gray-900 text-white min-h-screen relative overflow-hidden">
				 {/* Particle Background */}
				 <Particles
				id="tsparticles"
				init={particlesInit}
				options={{
					background: {
					  color: {
						value: "#111827",
					  },
					},
					fpsLimit: 60,
					interactivity: {
					  events: {
						onHover: {
						  enable: true,
						  mode: "repulse",
						},
						resize: true,
					  },
					  modes: {
						repulse: {
						  distance: 100,
						  duration: 0.4,
						},
					  },
					},
					particles: {
					  color: {
						value: "#00ffff",
					  },
					  links: {
						color: "#00ffff",
						distance: 150,
						enable: true,
						opacity: 0.5,
						width: 1,
					  },
					  collisions: {
						enable: false,
					  },
					  move: {
						direction: "none",
						enable: true,
						outModes: {
						  default: "bounce",
						},
						random: false,
						speed: 2,
						straight: false,
					  },
					  number: {
						density: {
						  enable: true,
						  area: 800,
						},
						value: 80,
					  },
					  opacity: {
						value: 0.5,
					  },
					  shape: {
						type: "circle",
					  },
					  size: {
						value: { min: 1, max: 3 },
					  },
					},
					detectRetina: true,
				  }}
				  
				className="absolute inset-0 w-full h-full z-0" // <- ensure coverage
			/>
			{/* Header Section */}
			<header className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-5xl font-extrabold mb-4 text-cyan-400">Dark Themed App</h1>
        <p className="text-xl text-gray-300 mb-8">
          A sleek, dark UI to engage your audience.
        </p>
        <a
          href="#cta"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-full transition"
        >
          Get Started
        </a>
      </header>

      {/* CTA Section */}
      <section id="cta" className="relative z-10 bg-gray-800 py-20 text-center px-6">
        <h2 className="text-4xl font-bold text-cyan-300 mb-4">
          Ready to Take the Leap?
        </h2>
        <p className="text-gray-400 mb-6 text-lg">
          Join thousands building fast, dark-themed web experiences.
        </p>
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-full transition">
          Join Now
        </button>
      </section>
				{/* <Navbar />
				<Header /> */}
			</div>
			{/* <Partners />
			<Feature />
			<CTA />
			<Footer /> */}
		</div>
	);
};

export default Landing;
