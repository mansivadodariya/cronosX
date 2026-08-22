import React from 'react'
import Herobanner from './herobanner'
import AiCockpit from './aiCockpit'
import CardList from './cardList'
import Platform from './platform'
import Capabilities from './capabilities'
import AiAssistant from './aiAssistant'
import HowitWorks from './howitWorks'
import ChartAnalysis from './chartAnalysis'
import BreakoutDetection from './breakoutDetection'
import AiAnalyst from './aiAnalyst'
import BeforeAfterComparison from './beforeAfterComparison'
import TeamUp from './teamUp'
import Testimonials from './testimonials'
import GlobalNetworkMap from './globalNetworkMap'
import ReadytoPut from './readytoPut'

export default function HomePage() {
    return (
        <div>
            <Herobanner />
            <AiCockpit />
            {/* <CardList /> */}
            {/* <Platform /> */}
            <Capabilities />
            <BeforeAfterComparison />
            {/* <AiAssistant /> */}
            <HowitWorks />
            <BreakoutDetection />
            <ChartAnalysis />
            <AiAnalyst />
            <TeamUp />
            <Testimonials />
            <GlobalNetworkMap />
            <ReadytoPut />
        </div>
    )
}

