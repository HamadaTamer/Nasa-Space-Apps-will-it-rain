// src/components/core/AboutPageContent.tsx

import React from 'react';
import { ArrowTrendingUpIcon, SunIcon, ComputerDesktopIcon, AdjustmentsHorizontalIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const AboutPageContent: React.FC = () => {
    // Content pulled and summarized from the NASA Space Apps Proposal PDF
    const sections = [
        {
            title: "Problem: Static Forecasts in a Changing Climate",
            icon: ArrowTrendingUpIcon,
            color: "text-red-400",
            content: "Current weather apps provide reliable forecasts only 1-2 weeks ahead. For longer horizons, outdoor planning relies on static, 30-year averages (climatology) that fail to capture observed shifts and changes in conditions due to global warming. This leaves long-term event decisions uncertain and risk-prone."
        },
        {
            title: "Our Solution: The Climate Trend Analyzer",
            icon: SunIcon,
            color: "text-yellow-400",
            content: "The Analyzer is a tool that transforms decades of NASA Earth observation data (precipitation, temperature, wind, etc.) into actionable, probabilistic insights. We provide three layers of analysis for any user-specified location and future date, going far beyond simple averages."
        }
    ];

    const methodologySteps = [
        { name: "Historical Baseline", description: "Calculates the percentage of past years where a specific condition (e.g., heavy rain) occurred on or around the target date.", emoji: "📊" },
        { name: "Trend Detection & Adjustment", description: "Uses statistical rigor (like the Mann-Kendall test) to quantify shifts over time and adjust the probability for a realistic, forward-looking view.", emoji: "📈" },
        { name: "ML-Informed Projection", description: "Applies machine learning models to capture complex, non-linear patterns, providing an advanced estimate of future risks.", emoji: "🤖" },
    ];

    const valueProposition = [
        { name: "Clarity", description: "Simple probabilities expressed clearly in numbers, graphs, and text summaries.", icon: ComputerDesktopIcon },
        { name: "Future-Focus", description: "Probabilities are adjusted for climate change, not just based on the past.", icon: AdjustmentsHorizontalIcon },
        { name: "Relevance", description: "Customized to the user's exact location and date.", icon: AcademicCapIcon },
    ];

    return (
        <div className="container mx-auto px-6 py-12 text-gray-100">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                    About Our Solution
                </h1>
                <p className="text-xl text-blue-400">
                    Will It Rain On My Parade? | NASA Space Apps Challenge 2025
                </p>
            </header>

            {/* Problem & Solution Summary */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                {sections.map((section, index) => (
                    <div key={index} className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-700">
                        <div className="flex items-center mb-4">
                            <section.icon className={`w-8 h-8 ${section.color} mr-3`} />
                            <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            {section.content}
                        </p>
                    </div>
                ))}
            </div>

            {/* Methodology/Three Layers of Insight */}
            <h2 className="text-3xl font-bold text-white mb-8 border-b border-blue-600 pb-2">
                Three Layers of Climate Insight (Methodology)
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {methodologySteps.map((step, index) => (
                    <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-xl transition-transform hover:scale-[1.02] border-t-4 border-blue-600">
                        <div className="text-4xl mb-3">{step.emoji}</div>
                        <h3 className="text-xl font-semibold text-white mb-2">{step.name}</h3>
                        <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                ))}
            </div>

            {/* Value Proposition */}
            <h2 className="text-3xl font-bold text-white mb-8 border-b border-blue-600 pb-2">
                Value Proposition
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-4xl mx-auto text-center">
                Our solution surpasses alternatives by moving beyond averages. We highlight how probabilities are evolving, ensuring outdoor planners have fewer surprises and better-informed decisions.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
                {valueProposition.map((prop, index) => (
                    <div key={index} className="bg-gray-700 p-5 rounded-lg shadow-md flex flex-col items-center text-center">
                        <prop.icon className="w-10 h-10 text-green-400 mb-3" />
                        <h3 className="text-lg font-bold text-white mb-1">{prop.name}</h3>
                        <p className="text-sm text-gray-400">{prop.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutPageContent;