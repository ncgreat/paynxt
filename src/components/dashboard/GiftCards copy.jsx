import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card"
import { ArrowLeft, Gift, Plus, Search } from "lucide-react";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

 const GiftCards = () => {
  const navigate = useHistory();
  const [giftCardBrands, setGiftCardBrands] = useState([]);
  
  const getBaseUrl = () => {
		return `${import.meta.env.VITE_API_BASE_URL}/api`;
	};

const itemsPerPage = 4;
const [currentPage, setCurrentPage] = useState(0);

const totalPages = Math.ceil(giftCardBrands.length / itemsPerPage);

const handlePrev = () => {
  setCurrentPage(prev => Math.max(prev - 1, 0));
};

const handleNext = () => {
  setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
};

  const giftCardBrands1 = [
    {
      name: "Amazon",
      logo: "🛒",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50/80",
      reloadlyID:5
    },
    {
      name: "Apple",
      logo: "🍎",
      color: "from-gray-700 to-black",
      bgColor: "bg-gray-50/80",
      reloadlyID:5
    },
    {
      name: "Google Play",
      logo: "🎮",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50/80",
      reloadlyID:5
    },
    {
      name: "Netflix",
      logo: "🎬",
      color: "from-red-600 to-red-800",
      bgColor: "bg-red-50/80",
      reloadlyID:5
    },
    {
      name: "Spotify",
      logo: "🎵",
      color: "from-green-600 to-emerald-700",
      bgColor: "bg-green-50/80",
      reloadlyID:5
    },
    {
      name: "Starbucks",
      logo: "☕",
      color: "from-green-700 to-green-900",
      bgColor: "bg-green-50/80",
      reloadlyID:5
    }
  ];

const allowedBrands = [
  "Google Play",
  "Amazon",
  "Airbnb",
  "Adidas",
  "Binance",
  "Best Buy",
  "American Express",
  "Crypto Giftcard",
  "Crypto Voucher",
  "Applebee's",
  "App Store & iTunes"
];

const brands = data.content
  .filter(item => allowedBrands.includes(item.brand.brandName))
  .map(item => ({
    name: item.productName, // Keep country-specific product name for clarity (e.g., "Adidas US")
    logo: {
      "Amazon": "🛒",
      "Google Play": "🎮",
      "Airbnb": "🏠",
      "Adidas": "👟",
      "Binance": "🪙",
      "Best Buy": "📦",
      "American Express": "💳",
      "Crypto Giftcard": "💰",
      "Crypto Voucher": "🧾",
      "Applebee's": "🍔",
      "App Store & iTunes": "🍎"
    }[item.brand.brandName] || "🎁",
    color: "from-slate-600 to-slate-900", // Optional gradient
    bgColor: "bg-white/70",
    reloadlyID: item.productId,
    image: item.logoUrls[0] || "",
  }));

    useEffect(() => {
    const fetchGiftCards = async () => {
      const response = await fetch(`${getBaseUrl()}/gift-cards`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			});
      const data = await response.json();
      console.log(data);
      const brands = data.content
        .filter(item => allowedBrands.includes(item.brand.brandName))
        .map(item => ({
          name: item.brand.brandName,
          logo: "🎁", // Optional — you can customize emojis
          color: "from-slate-600 to-slate-900", // or dynamic based on brand
          bgColor: "bg-white/70",
          reloadlyID: item.productId,
          image: item.logoUrls[0] || "", // fallback if logo missing
        }));
      setGiftCardBrands(brands);
    };


  }, []);

    useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        const { data } = await axios.get("/api/giftcards"); // replace with your backend API
        const filtered = data.content
          .filter(item => allowedBrands.includes(item.brand?.brandName))
          .map(item => ({
            name: item.productName,
            brand: item.brand.brandName,
            country: item.country.name,
            flagUrl: item.country.flagUrl,
            logo: {
              "Amazon": "🛒",
              "Google Play": "🎮",
              "Airbnb": "🏠",
              "Adidas": "👟",
              "Binance": "🪙",
              "Best Buy": "📦",
              "American Express": "💳",
              "Crypto Giftcard": "💰",
              "Crypto Voucher": "🧾",
              "Applebee's": "🍔",
              "App Store & iTunes": "🍎"
            }[item.brand.brandName] || "🎁",
            image: item.logoUrls?.[0],
            color: "from-sky-500 to-indigo-600",
            reloadlyID: item.productId,
          }));
        setGiftCardBrands(filtered);
      } catch (error) {
        console.error("Error fetching gift cards:", error);
      }
    };

    fetchGiftCards();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate.push("/")}
            className="hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gift Cards</h1>
            <p className="text-sm text-slate-600">Buy digital gift cards instantly</p>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6 border-0 shadow-lg bg-white/70 backdrop-blur-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search gift cards..." 
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-500"
            />
          </div>
        </Card>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Popular Brands</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* {giftCardBrands.map((brand, index) => (
              <Card 
                key={brand.name}
                className={`group relative p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer ${brand.bgColor} backdrop-blur-sm overflow-hidden animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative flex flex-col items-center text-center">
                  <div className={`bg-gradient-to-r ${brand.color} rounded-3xl p-4 mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 text-2xl`}>
                    {brand.logo}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">{brand.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">Digital delivery</p>
                </div>
              </Card>
            ))} */}
  {giftCardBrands.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((brand, index) => (
  <Card 
    key={brand.reloadlyID}
    className={`group relative p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer ${brand.bgColor} backdrop-blur-sm overflow-hidden animate-fade-in`}
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative flex flex-col items-center text-center">
      <div className={`bg-gradient-to-r ${brand.color} rounded-3xl p-4 mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
        <img src={brand.image} alt={brand.name} className="rounded-xl object-cover" />
      </div>
      <h3 className="font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">{brand.name}</h3>
      <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">Digital delivery</p>
    </div>
  </Card>
))}
          </div>
          <div className="flex justify-between items-center mt-6">
  <Button 
    disabled={currentPage === 0} 
    onClick={handlePrev}
    variant="outline"
    className="disabled:opacity-50"
  >
    Previous
  </Button>
  <span className="text-sm text-slate-600">
    Page {currentPage + 1} of {totalPages}
  </span>
  <Button 
    disabled={currentPage >= totalPages - 1} 
    onClick={handleNext}
    variant="outline"
    className="disabled:opacity-50"
  >
    Next
  </Button>
</div>
        </div>

        {/* Quick Actions */}
        <Card className="p-5 border-0 shadow-lg bg-white/70 backdrop-blur-sm animate-fade-in">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Plus className="h-4 w-4 mr-2" />
              Buy Custom Amount
            </Button>
            <Button variant="outline" className="w-full hover:bg-slate-50 transition-colors">
              <Gift className="h-4 w-4 mr-2" />
              View Purchase History
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GiftCards;