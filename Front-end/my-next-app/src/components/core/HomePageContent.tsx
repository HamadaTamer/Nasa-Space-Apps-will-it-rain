// src/components/core/HomePageContent.tsx

import React from 'react';
import Link from 'next/link';

const HERO_BG_CLASSES = "bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400";
const CARD_HOVER_CLASSES = "transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl";

export const HomePageContent: React.FC = () => {
    return (
        <div className="min-h-[calc(100vh-100px)]">
            {/* Hero Section */}
            <section className={`${HERO_BG_CLASSES} text-white py-20`}>
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Hybrid Climate Trend Analyzer</h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100">Plan smarter with NASA's climate data</p>
                    <div className="mb-12">
                        <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-6xl">🌍</span>
                        </div>
                    </div>
                    <Link href="/dashboard" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                        Start Analyzing
                    </Link>
                </div>
            </section>

            {/* Features Preview */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">Powerful Climate Analysis Tools</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className={`${CARD_HOVER_CLASSES} bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-8 rounded-xl text-center shadow-md`}>
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Baseline Probabilities</h3>
                            <p className="text-gray-600 dark:text-gray-400">Historical weather patterns and statistical analysis for informed planning</p>
                        </div>
                        <div className={`${CARD_HOVER_CLASSES} bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-8 rounded-xl text-center shadow-md`}>
                            <div className="text-4xl mb-4">📈</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Climate Trend Adjustments</h3>
                            <p className="text-gray-600 dark:text-gray-400">Real-time adjustments based on long-term climate trends and changes</p>
                        </div>
                        <div className={`${CARD_HOVER_CLASSES} bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-8 rounded-xl text-center shadow-md`}>
                            <div className="text-4xl mb-4">🤖</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">ML Projections</h3>
                            <p className="text-gray-600 dark:text-gray-400">Advanced machine learning models for future climate predictions</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};