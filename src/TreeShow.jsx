import React from 'react';

const TreeShow = ({ familyData }) => {
  console.log({ familyData });
  return (
    <div id='family-tree'>
      <h1>MAI Family Tree</h1>
      <div id='family-root'>
        <div id='family-tree-content-1'>
          <h2>Family Tree</h2>
          <ul>
            {familyData.id}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TreeShow;