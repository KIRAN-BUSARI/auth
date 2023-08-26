import React from 'react'
import './Navbar.css'

export default function Navbar() {
    return (
        <>
            <div className="header">
                <nav>
                    <h2 className='heading'><a href="/">PORTFOLIO</a></h2>
                    <ul>
                        <li><a href="/">HOME</a></li>
                        <li><a href="/about">ABOUT</a></li>
                        <li><a href="/skills">SKILLS</a></li>
                    </ul>
                    <div>
                        {/* <button className='bg-[#fff] px-3 py-0' onClick={Contact}>Contact Me!</button> */}
                        <button className='bg-[#ff7070] px-3 py-0'><a href="/contact">Contact Me!</a></button>
                    </div>
                </nav>
            </div>
        </>
    )
}
