// src/components/AdminLogs.tsx

import { FunctionalComponent } from "preact";
import { content } from "../content";
import { useMockAuth } from "./models/userModel";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";

interface SectionVersion {
  versionId: number;
  title: string;
  diffs?: string;
  editedBy: number;
  editDate: string;
  changes?: string[];
}

export const AdminLogs: FunctionalComponent = () => {
  const { getUsernameById, isAuthenticated } = useMockAuth();
  const [usernames, setUsernames] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      route("/admin"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchUsernames = async () => {
      const uniqueUserIds = [
        ...new Set(
          Object.values(content.sections)
            .flatMap((section) => section.versions)
            .map((version) => version.editedBy)
        ),
      ];

      const usernamePromises = uniqueUserIds.map(async (userId) => {
        const username = await getUsernameById(userId);
        return { userId, username };
      });

      const usernameResults = await Promise.all(usernamePromises);
      const usernameMap = usernameResults.reduce((acc, { userId, username }) => {
        acc[userId] = username;
        return acc;
      }, {} as { [key: number]: string });

      setUsernames(usernameMap);
    };

    fetchUsernames();
  }, []);

  const allSectionVersions = Object.values(content.sections).flatMap((section) =>
    section.cards.flatMap((card) =>
      card.versions.map((version) => ({
        ...version,
        articleTitle: card.versions[0].title, // Assuming the first version contains the initial title
      }))
    )
  );

  const sortedVersions = allSectionVersions.sort((a, b) => new Date(b.editDate).getTime() - new Date(a.editDate).getTime());

  return (
    <div>
      <h2>All Changes History</h2>
      {sortedVersions.map((version, index) => (
        <div key={index}>
          <p>
            Article: <strong>{version.articleTitle}</strong>
          </p>
          <p>
            {version.versionId === 1 ? "Created" : "Edited"} by {usernames[version.editedBy] || "Loading..."} on {new Date(version.editDate).toLocaleString()}
          </p>
          {version.changes && version.changes.length > 0 && (
            <ul>
              {version.changes.map((change, idx) => (
                <li key={idx}>{change}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
