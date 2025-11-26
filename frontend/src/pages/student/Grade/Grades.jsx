import React, { useEffect, useState } from "react";
import { FaBook, FaClipboardList } from "react-icons/fa";

// SERVICES & UTILS
import apiClient from "../../../services/Api.jsx";

// COMPONENTS
import Card from "../../../components/common/Card.jsx";
import Table from "../../../components/common/Table.jsx";
import Badge from "../../../components/common/Badge.jsx";
import CircleLoader from "../../../components/CircleLoader.jsx";
import Button from "../../../components/common/Button.jsx";

export default function Grades() {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('student/assignments/grades/');
            const data = response.data || [];
            setGrades(data);
        } catch (error) {
            console.error(error);
            setError("Failed to load grades. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getGradeVariant = (grade) => {
        const score = parseFloat(grade);
        if (score >= 80) return "success";
        if (score >= 60) return "warning";
        return "danger";
    };

    const columns = [
        {
            header: "Assignment",
            key: "assignment_title",
            render: (row) => (
                <div>
                    <div className="font-medium text-gray-900">{row.assignment_title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{row.content}</div>
                </div>
            )
        },
        {
            header: "Subject",
            key: "subject_name",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <FaBook className="text-gray-400 text-xs" />
                    <span className="text-gray-700">{row.subject_name}</span>
                </div>
            )
        },
        {
            header: "Submitted",
            key: "submitted_at",
            render: (row) => (
                <span className="text-gray-600 text-sm">
                    {new Date(row.submitted_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            )
        },
        {
            header: "Grade",
            key: "grade",
            render: (row) => (
                <Badge variant={getGradeVariant(row.grade)}>
                    {parseFloat(row.grade).toFixed(1)}%
                </Badge>
            )
        },
        {
            header: "Feedback",
            key: "feedback",
            render: (row) => (
                row.feedback ? (
                    <div className="text-sm text-gray-600 italic border-l-2 border-gray-200 pl-2 max-w-xs">
                        {
                            row.feedback.length > 35 ? (
                                <span>{row.feedback.slice(0, 35)}...</span>
                            ) : (
                                <span>{row.feedback}</span>
                            )
                        }
                    </div>
                ) : (
                    <span className="text-gray-400 text-sm">-</span>
                )
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <CircleLoader />
            </div>
        );
    }

    // Calculate min width for chart based on number of grades
    const chartMinWidth = Math.max(600, grades.length * 80);

    return (
        <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
                        <p className="text-gray-600">Track your academic performance and feedback</p>
                    </div>
                    <Button variant="secondary" onClick={fetchData} icon={<FaClipboardList />}>
                        Refresh Data
                    </Button>
                </div>

                {/* Grade Performance Chart */}
                <Card title="Performance Overview">
                    {grades.length > 0 ? (
                        <div className="mt-6">
                            {/* Chart container with fixed aspect */}
                            <div className="flex gap-3">
                                {/* Y-axis */}
                                <div className="flex flex-col justify-between h-64 py-0.5">
                                    <span className="text-xs text-gray-500 leading-none">100%</span>
                                    <span className="text-xs text-gray-500 leading-none">80%</span>
                                    <span className="text-xs text-gray-500 leading-none">60%</span>
                                    <span className="text-xs text-gray-500 leading-none">40%</span>
                                    <span className="text-xs text-gray-500 leading-none">20%</span>
                                    <span className="text-xs text-gray-500 leading-none">0%</span>
                                </div>

                                {/* Chart area with scroll */}
                                <div className="flex-1 overflow-x-auto">
                                    <div style={{ minWidth: `${chartMinWidth}px` }}>
                                        {/* Grid and bars */}
                                        <div className="relative h-64 border-l-2 border-b-2 border-gray-300">
                                            {/* Grid lines */}
                                            {[100, 80, 60, 40, 20, 0].map((value) => (
                                                <div
                                                    key={value}
                                                    className="absolute left-0 right-0 border-t border-gray-200"
                                                    style={{
                                                        bottom: `${value}%`,
                                                        borderTopWidth: value === 0 ? '0px' : '1px'
                                                    }}
                                                />
                                            ))}

                                            {/* Bars */}
                                            <div className="absolute inset-0 flex items-end justify-start gap-8 px-6">
                                                {grades
                                                    .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at))
                                                    .map((item, index) => {
                                                        const grade = parseFloat(item.grade);
                                                        const heightPercent = Math.min(Math.max(grade, 0), 100);

                                                        let colorClass = "bg-red-500";
                                                        if (grade >= 80) colorClass = "bg-green-500";
                                                        else if (grade >= 60) colorClass = "bg-indigo-500";

                                                        const submittedDate = new Date(item.submitted_at);
                                                        const formattedDate = submittedDate.toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        });

                                                        return (
                                                            <div key={index} className="relative group h-full flex flex-col justify-end" style={{ width: '48px' }}>
                                                                {/* Bar */}
                                                                <div
                                                                    className={`w-full rounded-t transition-all duration-300 ${colorClass} hover:opacity-90 shadow-sm relative cursor-pointer`}
                                                                    style={{ height: `${heightPercent}%` }}
                                                                >
                                                                    {/* Tooltip */}
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                                        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
                                                                            <div className="font-semibold mb-1">{item.assignment_title}</div>
                                                                            <div className="text-gray-300">Grade: {grade.toFixed(1)}%</div>
                                                                            <div className="text-gray-300 text-[10px] mt-0.5">{formattedDate}</div>
                                                                            {/* Arrow */}
                                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                                                                <div className="border-4 border-transparent border-t-gray-900"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Grade label on bar */}
                                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                                                                        {grade.toFixed(0)}%
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>

                                        {/* X-axis labels */}
                                        <div className="flex items-start justify-start gap-8 px-6 mt-3">
                                            {grades
                                                .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at))
                                                .map((item, index) => {
                                                    const submittedDate = new Date(item.submitted_at);
                                                    const formattedDate = submittedDate.toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    });

                                                    return (
                                                        <div key={index} className="text-center" style={{ width: '48px' }}>
                                                            <div className="text-xs text-gray-600 font-medium" title={formattedDate}>
                                                                {formattedDate}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                                    <span className="text-xs text-gray-600">Excellent (80%+)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                                    <span className="text-xs text-gray-600">Good (60-79%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                                    <span className="text-xs text-gray-600">Needs Improvement (&lt;60%)</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400">
                            <div className="text-center">
                                <FaClipboardList className="mx-auto text-4xl mb-2 opacity-50" />
                                <p>No grade data available</p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Grades Table */}
                <Card title="Grade History">
                    {error ? (
                        <div className="p-4 text-red-600 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={grades}
                            emptyMessage="No grades available yet."
                        />
                    )}
                </Card>
            </div>
        </div>
    );
}