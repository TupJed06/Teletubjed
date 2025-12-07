'use client';

import React, { useState, useEffect } from 'react';
import getHistories from '@/libs/History/getHistories'; 
import { HistoryLog } from '@interfaces/index';

export default function HistoryPage() {
  const [logs, setLogs] = useState<HistoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const formatDecimalTime = (totalMinutes: number) => {
  const mins = Math.floor(totalMinutes);
  const secs = Math.round((totalMinutes - mins) * 60);
  if (secs === 60) {
    return `${mins + 1}:00`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHistories();
        if (response.success) {
          const formattedLogs: HistoryLog[] = response.data.map((item: any) => ({
            id: item._id,
            no: item.occasion, 
            modeName: item.focusMode.focusName, 
            totalRound: item.totalRound, 
            focusTime: item.focusTime,
            relaxTime: item.repeatOn? item.relaxTime: 0,
            startTime: item.startTime,
            endTime: item.endTime,   
            avgBrightness: item.avgLight || 0,
            avgTemperature: item.avgTemp || 0,
            avgHumidity: item.avgHum || 0,
            focus: item.focus  
          }));

          setLogs(formattedLogs);
        } else {
          console.error("Failed to fetch history:", response.message);
        }
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading History...</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Session History</h1>
      
      {logs.length === 0 ? (
        <p className="text-gray-500">No history found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Focus</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Total Round</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Focus Time</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Relax Time</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Enviroment:(Temp/Hum/Light)</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Focus(%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                    {log.no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {log.modeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {log.totalRound}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {log.focusTime ? formatDecimalTime(log.focusTime) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {log.relaxTime ? formatDecimalTime(log.relaxTime) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {new Date(log.startTime).toLocaleDateString()} <br/>
                    <span className="text-xs">{new Date(log.startTime).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {log.endTime ? (
                      <>
                        {new Date(log.endTime).toLocaleDateString()}
                        <br />
                        <span className="text-xs">
                          {new Date(log.endTime).toLocaleTimeString()}
                        </span>
                      </>
                    ) : ("-")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {log.avgTemperature.toFixed(2)}°C / {log.avgHumidity.toFixed(2)}% / {log.avgBrightness.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  text-center text-sm text-gray-500">
                    {log.focus?log.focus.toFixed(2):"-"}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}