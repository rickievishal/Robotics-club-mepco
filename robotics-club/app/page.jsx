"use client"
import Image from "next/image";
import HeroOverlay from "./components/HeroOverlay";
import Marquee from "react-fast-marquee";
import HomeCard from "./components/HomeCard";
import Cubes from "./components/Animated-comps/Cube";
import ObsCard from "./components/ObsCard";
import {v4 as uuid} from 'uuid';
import Button from "./components/Button";
import CustomButton from "./components/custom-components/CustomButton";
import  { AnimatePresence, motion }  from "framer-motion";
import Link from "next/link";
export default function Home() {
  
  const obData = [{
    name : "Vishal",
    role : "Creative Director",
    imgUrl : "https://i.pinimg.com/736x/eb/de/62/ebde6293d007c873ce1cda392b01f847.jpg"
  },{
    name : "Kaushik",
    role : "Executive Member",
    imgUrl : "https://i.pinimg.com/736x/eb/de/62/ebde6293d007c873ce1cda392b01f847.jpg"
  },{
    name : "Gauresh",
    role : "Membership Coordinator",
    imgUrl : "./assets/gauresh.png"
  },{
    name : "Nivetha",
    role : "Membership Coordinator",
    imgUrl : "https://i.pinimg.com/736x/eb/de/62/ebde6293d007c873ce1cda392b01f847.jpg"
  },{
    name : "Baruch Ephrald Selvin",
    role : "Software Team",
    imgUrl : "https://i.pinimg.com/736x/eb/de/62/ebde6293d007c873ce1cda392b01f847.jpg"
  },{
    name : "Prasath",
    role : "Software Team",
    imgUrl : "https://i.pinimg.com/736x/eb/de/62/ebde6293d007c873ce1cda392b01f847.jpg"
  },{
    name : "Pavarna",
    role : "Software Team",
    imgUrl : "https://i.pinimg.com/736x/eb/de/62/ebde6293d007c873ce1cda392b01f847.jpg"
  },{
    name : "Subha Lakshmi",
    role : "Software Team",
    imgUrl : "https://i.pinimg.com/736x/eb/de/62/ebde6293d007c873ce1cda392b01f847.jpg"
  },{
    name : "Subha Lakshmi",
    role : "Software Team",
    imgUrl : "https://i.pinimg.com/736x/eb/de/62/ebde6293d007c873ce1cda392b01f847.jpg"
  },{
    name : "Sri Mahalakshmi",
    role : "Membership Team",
    imgUrl : "https://i.pinimg.com/736x/eb/de/62/ebde6293d007c873ce1cda392b01f847.jpg"
  }
]
  return (
   <div className="w-screen flex flex-col tracking-[-1px]">
     <div className="w-screen h-[90vh] relative overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
      >
        <source src="assets/hero.mp4" type="video/mp4" />
      </video>
      <HeroOverlay/>
    </div>
    <div className="w-full ">
      <Marquee autoFill={true} className="text-black bg-[var(--primary)] py-2 font-light text-lg">
        {" "}Welcome to the Robotics Club 
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="50" height="50" aria-label="black asterisk">
          <g transform="translate(100,100)" stroke="#000" strokeWidth="10" strokeLinecap="round">
            <line x1="0" y1="-70" x2="0" y2="70" />
            <line x1="-60" y1="-35" x2="60" y2="35" />
            <line x1="-60" y1="35" x2="60" y2="-35" />
          </g>
        </svg>
        Where ideas turn into machines! We host weekly hands-on events every Saturday, from coding challenges to epic robot battles. Build, code, and create with fellow innovators, and get your hands on cutting-edge tech. 
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="50" height="50" aria-label="black asterisk">
          <g transform="translate(100,100)" stroke="#000" strokeWidth="10" strokeLinecap="round">
            <line x1="0" y1="-70" x2="0" y2="70" />
            <line x1="-60" y1="-35" x2="60" y2="35" />
            <line x1="-60" y1="35" x2="60" y2="-35" />
          </g>
        </svg>
        Whether you’re a beginner or a bot wizard, there’s always something to spark your circuits. 
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="50" height="50" aria-label="black asterisk">
          <g transform="translate(100,100)" stroke="#000" strokeWidth="10" strokeLinecap="round">
            <line x1="0" y1="-70" x2="0" y2="70" />
            <line x1="-60" y1="-35" x2="60" y2="35" />
            <line x1="-60" y1="35" x2="60" y2="-35" />
          </g>
        </svg>
        Let’s engineer the future, one project at a time! 
      </Marquee>
    </div>
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-24 flex flex-col items-center justify-center">
        <h1 className="text-4xl text-[var(--primary)] font-bold text-center mb-8">Welcome to the Robotics Club</h1>
        <p className="text-lg text-gray-100 text-center max-w-2xl leading-tight">
          Join us every Saturday for hands-on events, coding challenges, and robot battles. Whether you're a beginner or a pro, there's always something to spark your circuits!
        </p>
        
        <div className="mx-auto max-w-4xl w-full grid grid-cols-2 mt-16 gap-4 ">
          <HomeCard className="col-span-1"/>
          <HomeCard className="col-span-1"/>
          <HomeCard className="col-span-1"/>
          <div className="bg-[var(--primary)] col-span-1 h-[400px] rounded-lg text-8xl px-2 flex flex-col items-start justify-start">
              <p className="flex items-center">
                Vision 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="80" height="80" aria-label="black asterisk">
                  <g transform="translate(100,100)" stroke="#000" strokeWidth="15" strokeLinecap="round">
                    <line x1="0" y1="-70" x2="0" y2="70" />
                    <line x1="-60" y1="-35" x2="60" y2="35" />
                    <line x1="-60" y1="35" x2="60" y2="-35" />
                  </g>
                </svg>
              </p>
              <p className="flex items-center">
                Precise
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="80" height="80" aria-label="black asterisk">
                  <g transform="translate(100,100)" stroke="#000" strokeWidth="15" strokeLinecap="round">
                    <line x1="0" y1="-70" x2="0" y2="70" />
                    <line x1="-60" y1="-35" x2="60" y2="35" />
                    <line x1="-60" y1="35" x2="60" y2="-35" />
                  </g>
                </svg>
              </p>
              <p className="flex items-center">
                Vibe’d
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="80" height="80" aria-label="black asterisk">
                  <g transform="translate(100,100)" stroke="#000" strokeWidth="15" strokeLinecap="round">
                    <line x1="0" y1="-70" x2="0" y2="70" />
                    <line x1="-60" y1="-35" x2="60" y2="35" />
                    <line x1="-60" y1="35" x2="60" y2="-35" />
                  </g>
                </svg>
              </p>
              <p className="flex items-center">
                Amp’d
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="80" height="80" aria-label="black asterisk">
                  <g transform="translate(100,100)" stroke="#000" strokeWidth="15" strokeLinecap="round">
                    <line x1="0" y1="-70" x2="0" y2="70" />
                    <line x1="-60" y1="-35" x2="60" y2="35" />
                    <line x1="-60" y1="35" x2="60" y2="-35" />
                  </g>
                </svg>
              </p>
          </div>
          {/* <div
            className="col-span-1 flex flex-col items-center justify-center"
            style={{ padding: 0, width: '100%', height: '100%', position: 'relative' }}
          >
            <Cubes
              gridSize={6}
              maxAngle={-30}
              radius={4}
              cubeSize={50}
              borderStyle="1px solid #1a1a2e"
              faceColor="#21fa1d"
              rippleColor="#1a1a2e"
              rippleSpeed={1.5}
              autoAnimate={true}
              rippleOnClick={true}
            />
          </div> */}
        </div>
      </div>
    </div>
    <div className="w-full">
            <div className="max-w-7xl mx-auto flex flex-col justify-center items-center px-2 sm:py-8 lg:py-24 py-32">

                  <h3 className="text-4xl text-[var(--primary)]">
                    Meet Our Incredible Team.
                  </h3>
                  <p className="max-w-xl text-gray-200 text-center mt-8">
                   This incredible crew makes the impossible happen — the innovators and problem-solvers behind every workshop, event, and competition, turning wild ideas into working robots.
                  </p>
                  <div className="flex flex-wrap items-center justify-center mt-16 gap-4">
                    <div className="w-full flex justify-center items-center">
                      <h4 className="text-2xl text-[var(--primary)]">
                        Membership Coordinators.
                      </h4>
                    </div>
                    {
                      obData
                      .filter((data)=> data.role === "Membership Coordinator")
                      .map((data)=> (
                         <ObsCard
                              key={uuid()}
                              data={data}
                              className="w-[300px] h-[400px]"
                          />
                      ))      
                    }
                  </div>
                   <div className="flex flex-wrap items-center justify-center mt-16 gap-4">
                    <div className="w-full flex justify-center items-center">
                      <h4 className="text-2xl text-[var(--primary)]">
                        Software Team.
                      </h4>
                    </div>
                    {
                      obData
                      .filter((data)=> data.role === "Software Team")
                      .map((data)=> (
                         <ObsCard
                              key={uuid()}
                              data={data}
                              className="w-[300px] h-[400px]"
                          />
                      ))      
                    }
                  </div>
                  <div className="flex flex-wrap items-center justify-center mt-16 gap-4">
                    <div className="w-full flex justify-center items-center">
                      <h4 className="text-2xl text-[var(--primary)]">
                        Membership Team.
                      </h4>
                    </div>
                    {
                      obData
                      .filter((data)=> data.role === "Membership Team")
                      .map((data)=> (
                         <ObsCard
                              key={uuid()}
                              data={data}
                              className="w-[300px] h-[400px]"
                          />
                      ))      
                    }
                  </div>

                  
            </div>
    </div>
    <div className="w-full ">
      <Marquee autoFill={true} className="text-black bg-[var(--primary)] py-2 font-light text-lg">
        {" "}Welcome to the Robotics Club 
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="50" height="50" aria-label="black asterisk">
          <g transform="translate(100,100)" stroke="#000" strokeWidth="10" strokeLinecap="round">
            <line x1="0" y1="-70" x2="0" y2="70" />
            <line x1="-60" y1="-35" x2="60" y2="35" />
            <line x1="-60" y1="35" x2="60" y2="-35" />
          </g>
        </svg>
        Where ideas turn into machines! We host weekly hands-on events every Saturday, from coding challenges to epic robot battles. Build, code, and create with fellow innovators, and get your hands on cutting-edge tech. 
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="50" height="50" aria-label="black asterisk">
          <g transform="translate(100,100)" stroke="#000" strokeWidth="10" strokeLinecap="round">
            <line x1="0" y1="-70" x2="0" y2="70" />
            <line x1="-60" y1="-35" x2="60" y2="35" />
            <line x1="-60" y1="35" x2="60" y2="-35" />
          </g>
        </svg>
        Whether you’re a beginner or a bot wizard, there’s always something to spark your circuits. 
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="50" height="50" aria-label="black asterisk">
          <g transform="translate(100,100)" stroke="#000" strokeWidth="10" strokeLinecap="round">
            <line x1="0" y1="-70" x2="0" y2="70" />
            <line x1="-60" y1="-35" x2="60" y2="35" />
            <line x1="-60" y1="35" x2="60" y2="-35" />
          </g>
        </svg>
        Let’s engineer the future, one project at a time! 
      </Marquee>
    </div>
    <div className="w-full">
        <div className="max-w-7xl h-[300px] mx-auto px-4 lg:py-32 flex flex-col items-center justify-center py-32">
                  <AnimatePresence>
                  <motion.div layout={"size"} transition={{type:"spring",stiffness:300,damping:20 }} className=" text-4xl text-[var(--primary)] text-center flex items-center justify-center">
                   <motion.p layout className="mr-4" transition={{type:"spring",stiffness:300,damping:20,duration:0.5}} >
                     Join the cult. Be The cult. 
                   </motion.p>
                    <CustomButton/>
                  </motion.div>
                  </AnimatePresence>
                  <p className="text-gray-200 text-center max-w-xl mt-4">
                    We will conduct OB hunt on the starting of every odd semester.We evaluate the participants.
                  </p>
        </div>
    </div>
   </div>
  );
}
