import NumbersCard from "../cards/numbersCard";
import Image from "next/image";
export default function IntroSection() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center text-center md:text-left md:justify-around items-center mt-30 px-3">
        {/* Title Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-800">
            Event Sphere
          </h1>
          <h2 className="text-1xl xl:text-2xl font-semibold text-purple-600">
            Where Events Come to Life.
          </h2>
          <div className="text-sm xl:text-base text-gray-600 max-w-xs xl:max-w-md">
            Join a vibrant world of events tailored to your interests.
            EventSphere helps you find, manage, and experience events like never
            before.
          </div>
        </div>

        <div className="flex flex-col justify-center align-middle gap-2 sm:gap-3 md:mt-0 mt-3 md:gap-0 md:flex-row">
          <div className="flex md:flex-col gap-1 sm:gap-3 md:gap-0 relative">
            <div className="absolute top-[105px] left-[-125px] xl:top-[145px] xl:left-[-150px]  xl: w-[120px] xl:w-[140px]">
              <img
                src="/icons/hello.png"
                alt="Intro Background"
                className="invisible lg:visible w-full h-auto"
              />
            </div>

            <div className="md:mb-8 md:mt-8 lg:mb-4 lg:mt-4 xl:mb-6 xl:mt-6">
              <NumbersCard
                title="Registered Users"
                number="5867"
                icon="group"
              />
            </div>
            <div>
              <NumbersCard title="Events Created" number="2773" icon="party" />
            </div>
          </div>
          <div className="flex md:flex-col gap-1 sm:gap-3 md:gap-0">
            <div className="md:ml-8 md:mb-8 lg:ml-4 lg:mb-4 xl:ml-6 xl:mb-6">
              <NumbersCard
                title="User Reviews"
                number="1737"
                icon="satisfaction"
              />
            </div>
            <div className="md:ml-4 lg:ml-2 xl:ml-4">
              <NumbersCard title="Locations Covered" number="67" icon="map" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
