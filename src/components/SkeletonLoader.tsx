/** src/components/SkeletonLoader.tsx **/

import { Fragment, FunctionalComponent } from "preact";

interface SectionData {
  title: string;
  cards: {
    link: string;
    imgSrc: string;
    title: string;
    description: string;
    detailedDescription: string;
  }[];
}

interface SkeletonLoaderProps {
  sections: { [key: string]: SectionData };
  count: number;
}

export const SkeletonLoader: FunctionalComponent<SkeletonLoaderProps> = ({
  sections,
  count,
}) => {
  return (
    <Fragment>
      {Object.keys(sections).map((sectionKey) => (
        <div key={sectionKey} className="skeleton-section">
          <div className="skeleton-section-title"></div>
          {Array.from({
            length: Math.max(
              1,
              Math.floor(count / Object.keys(sections).length)
            ),
          }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-img"></div>
              <div className="skeleton-text">
                <div className="skeleton-line long"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </Fragment>
  );
};
