import React from 'react'
import Herobanner from './herobanner'
import Platform from './platform'
import AiAssistant from './aiAssistant'
import HowitWorks from './howitWorks'
import ChartAnalysis from './chartAnalysis'
import TeamUp from './teamUp'
import Testimonials from './testimonials'
import ReadytoPut from './readytoPut'

export default function HomePage() {
    return (
        <div>
            <Herobanner />
            <Platform />
            <AiAssistant />
            <HowitWorks />
            <ChartAnalysis />
            <TeamUp />
            <Testimonials />
            <ReadytoPut />
        </div>
    )
}
