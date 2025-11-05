"use client";

import {
  ProfileCompletionCard,
  ProfileLinksCard,
  ScoreCard,
} from "@/features/panel";
import { useSelector } from "react-redux";

export default function ReaderDashboard() {
  const userDetails = useSelector((state) => state.auth?.userData);

  const userName = userDetails
    ? userDetails.first_name + " " + userDetails.last_name
    : "Reader";
  // Mock user data - replace with Redux store in production
  const userDatas = {
    name: userName,
    roles: userDetails ? userDetails.roles : ["READER"],
    profile: {
      orcidConnected: true,
      institutionalEmail: true,
      rorConnected: false,
      openAlexConnected: true,
      googleScholar: true,
      researchGate: true,
      resumeUploaded: true,
      coverLetterUploaded: false,
    },
    links: {
      googleScholar: "https://scholar.google.com/citations?user=...",
      researchGate: "https://www.researchgate.net/profile/...",
    },
  };

  const scoreItems = [
    {
      label: "ORCID Connected",
      points: 20,
      completed: userDatas.profile.orcidConnected,
    },
    {
      label: "ROR Connected",
      points: 10,
      completed: userDatas.profile.rorConnected,
    },
    {
      label: "OpenAlex Connected",
      points: 10,
      completed: userDatas.profile.openAlexConnected,
    },
    {
      label: "Institutional Email",
      points: 10,
      completed: userDatas.profile.institutionalEmail,
    },
    {
      label: "Google Scholar",
      points: 15,
      completed: userDatas.profile.googleScholar,
    },
    {
      label: "ResearchGate",
      points: 15,
      completed: userDatas.profile.researchGate,
    },

    {
      label: "Resume Uploaded",
      points: 10,
      completed: userDatas.profile.resumeUploaded,
    },
    {
      label: "Cover Letter Uploaded",
      points: 10,
      completed: userDatas.profile.coverLetterUploaded,
    },
  ];

  const completedItems = scoreItems.filter((item) => item.completed).length;
  const completionPercentage = (completedItems / scoreItems.length) * 100;

  return (
    <div className=" mx-auto space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileCompletionCard completionPercentage={completionPercentage} />
        </div>
        <div>
          <ProfileLinksCard links={userDatas.links} />
        </div>
      </div>

      <ScoreCard
        scoreItems={scoreItems}
        completedItems={completedItems}
        completionPercentage={completionPercentage}
      />
    </div>
  );
}
