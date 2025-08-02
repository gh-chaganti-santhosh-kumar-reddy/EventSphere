import { FaLinkedin, FaXTwitter, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <div className="px-3"><footer className="p-10">
      <div className="flex flex-col justify-center bg-gray-600 rounded-xl">
        <div className=" flex justify-between pl-10 pr-10 pt-4">
          {/* Need Help */}
          <div>
            <h3 className="font-bold text-lg mb-4">Need Help</h3>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Blog</li>
              <li>Contact Us</li>
              <li>FAQs</li>
              <li>Terms of use</li>
              <li>News</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>SignUp</li>
              <li>Login</li>
              <li>Create Event</li>
              <li>Find Event</li>
              <li>Fees & Pricings</li>
              <li>Global Affiliate Marketing</li>
              <li>Organizer Features</li>
              <li>Why Event Sphere</li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Catagories</h3>
            <ul className="space-y-2 text-sm">
              <li>NewYear</li>
              <li>Entertainment</li>
              <li>Professional</li>
              <li>Training & Workshops</li>
              <li>College & Campus</li>
              <li>Exhibitions & Trade Shows</li>
              <li>Sports</li>
              <li>Spiritual & Wellness</li>
              <li>Activities</li>
              <li>Donations</li>
            </ul>
          </div>
        </div>
        {/* Contact Us */}
        <div className="flex justify-center gap-x-60 mt-3">
          <div className="">
            <h4 className="font-bold mb-2">Follow Us</h4>
            <div className="flex items-center space-x-4 mt-4">
              <FaLinkedin className="text-blue-600 bg-white rounded-full p-1 w-8 h-8" />
              <FaXTwitter className="text-black bg-white rounded-full p-1 w-8 h-8" />
            </div>
          </div>
          <div className="">
            <h4 className="font-bold mb-2">Contact Us</h4>
            <div className="flex items-center space-x-4 mt-4">
            <MdEmail className="text-red-500 bg-white rounded-md p-1 w-8 h-8" />
            <FaPhone className="text-black bg-white rounded-full p-1 w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="text-center text-black font-bold text-sm mt-10 pb-2">
          Copyright @ EventSphere Online Solutions Pvt Ltd. All Rights Reserved
        </div>
      </div>
    </footer></div>
    
  );
}
