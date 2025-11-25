import {
  DollarTwoTone, EuroTwoTone, PoundCircleTwoTone,
} from '@ant-design/icons';

const getCurrencyIcon = (countryCode: string) => {
  if (countryCode === 'IE') {
    return (
      <EuroTwoTone color="green" rev={undefined} style={{ margin: '4px' }} />
    );
  }
  if (countryCode === 'GB') {
    return <PoundCircleTwoTone color="green" rev={undefined} style={{ margin: '4px' }} />;
  }
  if (countryCode === 'PH') {
    return (
      <svg style={{ margin: '4px' }} viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#1890ff" />
        <path d="M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zm117.1 581.1c0 3.8-2.7 7-6.4 7.8-15.9 3.4-34.4 5.1-55.3 5.1-109.8 0-183-58.8-200.2-158H337c-4.4 0-8-3.6-8-8v-27.2c0-4.4 3.6-8 8-8h26.1v-36.9c0-4.4 0-8.7.3-12.8H337c-4.4 0-8-3.6-8-8v-27.2c0-4.4 3.6-8 8-8h31.8C388.5 345.7 460.7 290 567.4 290c20.9 0 39.4 1.9 55.3 5.4 3.7.8 6.3 4 6.3 7.8V346a8 8 0 01-9.6 7.8c-14.6-2.9-31.8-4.4-51.7-4.4-65.3 0-110.4 33.5-127.6 90.4h128.3c4.4 0 8 3.6 8 8V475c0 4.4-3.6 8-8 8H432.5c-.3 4.4-.3 9.1-.3 13.8v36h136.4c4.4 0 8 3.6 8 8V568c0 4.4-3.6 8-8 8H438c15.3 62 61.3 98.6 129.8 98.6 19.9 0 37.1-1.3 51.8-4.1 4.9-1 9.5 2.8 9.5 7.8v42.8z" fill="#e6f7ff" />
        <g transform="translate(340, 240)">
          <path fill="#1890ff" d="M64 32C46.3 32 32 46.3 32 64l0 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 64 0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 80 0c68.4 0 127.7-39 156.8-96l19.2 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-.7 0c.5-5.3 .7-10.6 .7-16s-.2-10.7-.7-16l.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-19.2 0C303.7 71 244.4 32 176 32L64 32zm190.4 96L96 128l0-32 80 0c30.5 0 58.2 12.2 78.4 32zM96 192l190.9 0c.7 5.2 1.1 10.6 1.1 16s-.4 10.8-1.1 16L96 224l0-32zm158.4 96c-20.2 19.8-47.9 32-78.4 32l-80 0 0-32 158.4 0z" />
        </g>
      </svg>
    );
  }
  return <DollarTwoTone color="green" rev={undefined} style={{ margin: '4px' }} />;
};

export {
  getCurrencyIcon,
};
