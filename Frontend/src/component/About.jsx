
const About = () => {
  return (
    <div className="bg-white text-gray-800">
      <header className="py-4 px-8 bg-white-500 text-white">
        <h1 className="text-3xl font-bold">About Our ML Project</h1>
      </header>

      <main className="container mx-auto px-8 py-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
          <p className="text-lg">
            Our machine learning project aims to revolutionize [brief description of project goals].
            Leveraging cutting-edge technologies like [mention specific ML technologies].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">The Team</h2>
          <div className="flex flex-wrap">
            {/* Individual team member cards */}
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              {/* Team member details */}
              <div className="bg-gray-100 p-4 rounded-lg">
                {/* Team member image */}
                <div className="w-20 h-20 rounded-full bg-gray-300 mb-4"></div>
                {/* Team member name */}
                <h3 className="text-lg font-semibold">Name</h3>
                {/* Team member role */}
                <p className="text-sm text-gray-600">Role</p>
              </div>
            </div>
            {/* Repeat this structure for other team members */}
          </div>
        </section>
      </main>

      <footer className="py-4 px-8 bg-white-500 text-white text-center">
        {/* Footer content */}
        <p>&copy; 2023 ML Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;