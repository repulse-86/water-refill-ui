import heroImg from '../../../../assets/hero.png'; // adjust path if needed

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16 md:py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
            Pure Water, <br />
            <span className="text-blue-600">Delivered Fresh</span>
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-md mx-auto md:mx-0">
            Refill your containers with premium purified water. Fast, affordable, and eco‑friendly.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg">
              Order Now
            </button>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold border border-blue-600 hover:bg-blue-50 transition">
              View Pricing
            </button>
          </div>
          <div className="mt-6 flex gap-6 text-sm text-gray-600 justify-center md:justify-start">
            <span>✅ Free delivery</span>
            <span>✅ 5‑step filtration</span>
            <span>✅ BPA‑free bottles</span>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src={heroImg}
            alt="Water refilling"
            className="w-full max-w-md rounded-2xl shadow-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}