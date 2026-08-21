import React from 'react'
import Herobanner from './herobanner'
import Platform from './platform'
import Capabilities from './capabilities'
import AiAssistant from './aiAssistant'
import HowitWorks from './howitWorks'
import ChartAnalysis from './chartAnalysis'
import BreakoutDetection from './breakoutDetection'
import AiAnalyst from './aiAnalyst'
import TeamUp from './teamUp'
import Testimonials from './testimonials'
import GlobalNetworkMap from './globalNetworkMap'
import ReadytoPut from './readytoPut'
import CardList from './cardList'

export default function HomePage() {
    return (
        <div>
            <Herobanner />
            <CardList />
            <Platform />
            <Capabilities />
            <AiAssistant />
            <HowitWorks />
            <ChartAnalysis />
            {/* <BreakoutDetection /> */}
            <AiAnalyst />
            <TeamUp />
            <Testimonials />
            <GlobalNetworkMap />
            <ReadytoPut />
        </div>
    )
}
