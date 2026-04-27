import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

// Lenis instance exposed for initialFX
export let lenis: Lenis | null = null;

const Navbar = () => {
  useEffect(() => {
    // Remove the smooth-wrapper/smooth-content height locking (was needed for ScrollSmoother)
    const wrapper = document.getElementById("smooth-wrapper");
    const content = document.getElementById("smooth-content");
    if (wrapper) wrapper.style.cssText = "";
    if (content) content.style.cssText = "";

    // Create Lenis instance
    lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    // Pause at start (same behaviour as before — initialFX resumes it)
    lenis.stop();

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis!.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Nav link click → smooth scroll to section
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let el = e.currentTarget as HTMLAnchorElement;
          let section = el.getAttribute("data-href");
          if (section) {
            const target = document.querySelector(section);
            if (target) lenis!.scrollTo(target as HTMLElement, { offset: 0 });
          }
        }
      });
    });

    return () => {
      lenis?.destroy();
      lenis = null;
      gsap.ticker.remove((time) => {
        lenis?.raf(time * 1000);
      });
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          NV
        </a>
        <a
          href="mailto:32024CE3693@students.csvtu.ac.in"
          className="navbar-connect"
          data-cursor="disable"
        >
          32024CE3693@students.csvtu.ac.in
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
