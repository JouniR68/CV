import React from "react";

const schedule = [
  {
    day: "Monday",
    tasks: [
      {
        title: "Writing (15 min)",
        description: "Write a short diary entry: 'What did I do last weekend?' Use Grammarly to check."
      },
      {
        title: "Listening (15 min)",
        description: "Watch a '6 Minute English' episode (BBC Learning English). Write down 3 new words."
      }
    ]
  },
  {
    day: "Tuesday",
    tasks: [
      {
        title: "Speaking (15 min)",
        description: "Speak out loud about your daily plans. Record yourself."
      },
      {
        title: "Reading (15 min)",
        description: "Read an article from newsinlevels.com. Learn 5 useful words or phrases."
      }
    ]
  },
  {
    day: "Wednesday",
    tasks: [
      {
        title: "Writing (15 min)",
        description: "Write an opinion text: 'Why I like or dislike winter.' Check with Grammarly."
      },
      {
        title: "Listening + Shadowing (15 min)",
        description: "Choose a short video and repeat sentences after the speaker."
      }
    ]
  },
  {
    day: "Thursday",
    tasks: [
      {
        title: "Speaking (15 min)",
        description: "Chat in English using Tandem/HelloTalk or speak solo for 10 minutes."
      },
      {
        title: "Writing (15 min)",
        description: "Write a short dialogue (e.g. in a restaurant or hotel)."
      }
    ]
  },
  {
    day: "Friday",
    tasks: [
      {
        title: "Review Day (30 min)",
        description: "Review your weekly writing. Speak about what you learned. Repeat difficult phrases aloud."
      }
    ]
  },
  {
    day: "Weekend (Bonus)",
    tasks: [
      {
        title: "Movie/Series (optional)",
        description: "Watch in English with English subtitles. Summarize it by speaking or writing."
      }
    ]
  }
];

export default function EnglishStudySchedule() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">English Study Weekly Schedule</h1>
      <div className="grid gap-6">
        {schedule.map((day) => (
          <div key={day.day} className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">{day.day}</h2>
            <ul className="list-disc list-inside space-y-2">
              {day.tasks.map((task, index) => (
                <li key={index}>
                  <strong>{task.title}</strong>: {task.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
