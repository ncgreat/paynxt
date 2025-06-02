import { useHistory } from 'react-router-dom';
import {
	Footer,
	Header,
	Navbar,
	Partners,
	Feature,
	CTA,
} from '../../containers';
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.

const Landing = () => {
	const [init, setInit] = useState(false);
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

	// this should be run only once per application lifetime
	useEffect(() => {
		initParticlesEngine(async (engine) => {
		  await loadAll(engine);
		}).then(() => {
		  setInit(true);
		});
	  }, []);
	
	  const particlesLoaded = (container) => {
		// console.log(container);
	  };

  const options = useMemo(
    () => ({
		background: {
			color: {
			  value: "#fff",
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
			  value: "#111827",
			},
			links: {
			  color: "#00ffff",
			  distance: 80,
			  enable: true,
			  opacity: 0.5,
			  width: 1,
			},
			collisions: {
			  enable: true,
			},
			move: {
			  direction: "none",
			  enable: true,
			  outModes: {
				default: "bounce",
			  },
			  random: true,
			  speed: 2,
			  straight: true,
			},
			number: {
			  density: {
				enable: true,
				area: 800,
			  },
			  value: 60,
			},
			opacity: {
			  value: 0.5,
			},
			shape: {
			  type: "square",
			},
			size: {
			  value: { min: 1, max: 3 },
			},
		  },
		  detectRetina: true,
    }),
    [],
  );

	
	const particlesInit = async (main) => {
		console.log("Initializing particles...");
	  
		await loadFull(main);
	  
		console.log("Particles loaded with main instance:", main);
	  };

	  return (
		<div className="bg-gray-900  min-h-screen relative overflow-hidden">
		  {/* Conditionally render particles after init */}
		  {init && (
			<Particles
			  id="tsparticles"
			  particlesLoaded={particlesLoaded}
			  options={options}
			  className="absolute inset-0 w-full h-full z-0"
			/>
		  )}
	  
		  {/* Main content */}
		  {/* <header className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-6">
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
	  
		  <section id="cta" className="relative z-10 bg-gray-800 py-20 text-center px-6">
			<h2 className="text-4xl font-bold text-cyan-300 mb-4">Ready to Take the Leap?</h2>
			<p className="text-gray-400 mb-6 text-lg">
			  Join thousands building fast, dark-themed web experiences.
			</p>
			<button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-full transition">
			  Join Now
			</button>
		  </section> */}

		  	<Navbar />
			<Header />
			<div className="relative z-10 bg-white py-20 text-center px-6">
				<Partners />
				<Feature />
				<CTA />
				<Footer />
			</div>
			
		</div>
	  );
	  
};

export default Landing;
