import { useState } from 'react'

import Navbar from '../components/navbar.jsx'
import { useAuth } from '../firebase/authContext.jsx'


function TestimonialPage() {
  const { currentUser } = useAuth();

  return (
    
    <>
    <Navbar currentUser={currentUser}/>

    <main>
    <article>
       <header className="relative mx-auto mt-20 max-w-screen-lg rounded-t-lg bg-white pt-16 text-center shadow-lg">
  <p className="text-gray-500">About Aucma Service Center</p>
  <h1 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
    Supporting Warehouse Operations Nationwide
  </h1>
  <p className="mt-6 text-lg text-gray-700">
    A dedicated platform ensuring your Aucma refrigeration units and warehouse equipment receive expert maintenance—
    fast, efficient, and certified.
  </p>
    <br />
    <img class="-z-10 absolute top-0 left-0 mt-10 h-96 w-full object-cover" src="https://images.unsplash.com/photo-1504672281656-e4981d70414b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />

</header>

<div className="mx-auto max-w-screen-lg space-y-10 rounded-b-lg bg-white px-8 pt-10 pb-20 text-gray-700 sm:shadow-lg">
  <h2 className="text-2xl font-semibold">Our Mission</h2>
  <p>
    The Aucma Service Center was established to provide streamlined, reliable maintenance support for all Aucma warehouse
    facilities. We understand how vital refrigeration units and equipment are to your operations, and our goal is to minimize
    downtime while maximizing service quality.
  </p>

  <h2 className="text-2xl font-semibold">What We Offer</h2>
  <ul className="list-disc list-inside space-y-2">
    <li>
      <strong>Service Request System:</strong> Submit maintenance issues through a centralized online form. Attach photos,
      describe the issue, and set urgency levels.
    </li>
    <li>
      <strong>Live Status Tracking:</strong> Monitor request progress—from submission to technician dispatch and job completion.
    </li>
    <li>
      <strong>Service Logs & History:</strong> Access a complete record of your site's service history for audits, compliance,
      or internal reference.
    </li>
    <li>
      <strong>Certified Onsite Technicians:</strong> All service work is performed at the warehouse by trained personnel using
      genuine Aucma tools and parts.
    </li>
  </ul>

  <h2 className="text-2xl font-semibold">Who Can Use This Platform?</h2>
  <p>
    This platform is built specifically for authorized Aucma warehouse staff and admin coordinators. It is not available for
    public or residential servicing. Every request is tied to a registered Aucma facility.
  </p>

  <h2 className="text-2xl font-semibold">Need Help?</h2>
  <p>
    If you encounter any issues while using the system—whether booking a service or tracking progress—reach out to your assigned
    Aucma admin or contact our central support line. We’re here to ensure your warehouse never skips a beat.
  </p>
</div>


    </article>

    {/* <article>
        <header class="mx-auto mt-20 max-w-screen-lg rounded-t-lg bg-white pt-16 text-center shadow-lg">
        <p class="text-gray-500">Published April 4, 2022</p>
        <h1 class="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">Why quit now?</h1>
        <p class="mt-6 text-lg text-gray-700">You've come way farther than you expected</p>
        <div class="mt-6 flex flex-wrap justify-center gap-2">
        </div>
        <img class="-z-10 absolute top-0 left-0 mt-10 h-96 w-full object-cover" src="https://images.unsplash.com/photo-1504672281656-e4981d70414b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />
        </header>

        <div class="mx-auto max-w-screen-lg space-y-12 rounded-b-lg bg-white px-8 pt-10 pb-20 font-serif text-lg tracking-wide text-gray-700 sm:shadow-lg">
        <h2 class="text-2xl font-semibold">First Steps to Life Betterment</h2>
        <blockquote class="max-w-lg border-l-4 px-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda maiores tempora quod ducimus dolore!
            <span class="whitespace-nowrap text-sm">— Daniel Lehmer</span>
        </blockquote>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto enim maxime sit laudantium! Dolore atque, maxime iusto ut quas distinctio reiciendis animi voluptatibus soluta molestias, mollitia officiis laboriosam illum earum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus similique reiciendis et recusandae provident repellendus rem doloremque eaque error assumenda?</p>
        </div>
    </article> */}
    </main>

    <div class="w-fit mx-auto mt-10 flex space-x-2">
    <div class="h-0.5 w-2 bg-gray-600"></div>
    <div class="h-0.5 w-32 bg-gray-600"></div>
    <div class="h-0.5 w-2 bg-gray-600"></div>
    </div>

    <aside aria-label="Recent Posts" class="mx-auto mt-10 max-w-screen-xl py-20">
  <div class="mx-auto max-w-screen-xl px-4 md:px-8">
    <div class="mb-10 md:mb-16">
      <h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Most Recent Posts</h2>
      <p class="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
        Hear what our warehouse partners are saying about the Aucma Service Center.
      </p>
    </div>
    <div class="">
      <div className="container mx-auto grid grid-cols-1 gap-8 lg:gap-20 md:px-10 md:pb-10 lg:grid-cols-2">
        <div className="flex flex-col items-center mx-12 lg:mx-0">
          <div className="relative text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="absolute top-0 left-0 w-8 h-8 dark:text-gray-300">
              <path d="M232,246.857V16H16V416H54.4ZM48,48H200V233.143L48,377.905Z"></path>
              <path d="M280,416h38.4L496,246.857V16H280ZM312,48H464V233.143L312,377.905Z"></path>
            </svg>
            <p className="px-6 py-1 text-lg italic">
              We’ve had multiple equipment issues resolved in less than a day. The Aucma team is quick, reliable, and keeps our operations running smoothly.
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="absolute bottom-0 right-0 w-8 h-8 dark:text-gray-300">
              <path d="M280,185.143V416H496V16H457.6ZM464,384H312V198.857L464,54.1Z"></path>
              <path d="M232,16H193.6L16,185.143V416H232ZM200,384H48V198.857L200,54.1Z"></path>
            </svg>
          </div>
          <span className="w-12 h-1 my-2 rounded-lg dark:bg-gray-900"></span>
          <p>Logistics Supervisor</p>
        </div>
        <div className="flex flex-col items-center max-w-lg mx-12 lg:mx-0">
          <div className="relative text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="absolute top-0 left-0 w-8 h-8 dark:text-gray-300">
              <path fill="currentColor" d="M232,246.857V16H16V416H54.4ZM48,48H200V233.143L48,377.905Z"></path>
              <path fill="currentColor" d="M280,416h38.4L496,246.857V16H280ZM312,48H464V233.143L312,377.905Z"></path>
            </svg>
            <p className="px-6 py-1 text-lg italic">
              Having access to real-time updates and service logs makes a huge difference. We no longer waste time following up or guessing service status.
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="absolute bottom-0 right-0 w-8 h-8 dark:text-gray-300">
              <path fill="currentColor" d="M280,185.143V416H496V16H457.6ZM464,384H312V198.857L464,54.1Z"></path>
              <path fill="currentColor" d="M232,16H193.6L16,185.143V416H232ZM200,384H48V198.857L200,54.1Z"></path>
            </svg>
          </div>
          <span className="w-12 h-1 my-2 rounded-lg dark:bg-gray-900"></span>
          <p>Warehouse Admin</p>
        </div>
      </div>
    </div>
  </div>
</aside>


    </>
    
  )
}

export default TestimonialPage
