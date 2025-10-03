// src/app/dashboard/page.tsx

"use client";

import React from 'react';
import { ClimateTrendAnalyzer } from '../../components/core/ClimateTrendAnalyzer';

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-6 py-8">
            <ClimateTrendAnalyzer />
        </div>
    );
}