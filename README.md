# Home Valuation Chart

Custom chart with [Chart.js](https://www.chartjs.org/).

Screenshots consist of two version: 1) without visible data points, and 2) with visible data points.

Both versions demonstrate 12 months of data, 6 months of data, and a custom tooltip showing the "Average estimate" and "Range of estimate" for that data point.

<hr style='margin: 3em 0'/>

## Without point radius:

### 12M view

![No point radius 12M](readme-images/no-point-radius-12m.png)

### 6M view

![No point radius 6M](readme-images/no-point-radius-6m.png)

### Custom tooltip

![No point radius hover](readme-images/no-point-radius-hover.png)

## With point radius (may be better for touch devices):

### 12M view

![Point radius 12m](readme-images/point-radius-12m.png)

### 6M view

![Point radius 6m](readme-images/point-radius-6m.png)

### Custom tooltip

![Point radius hover](readme-images/point-radius-hover.png)

# How to run locally

- After cloning, install npm packages

  - `npm install`

- Use parcel-bundler to watch for frontend changes

  - `npm run watch`

- Use nodemon to watch for backend changes

  - `npm run startDev`

# TODO

- Gridlines and ticks seem to be dependent on each other (can't have one without the other). Figure out how to add ticks to X axis, but not gridlines.
- When hovering over a data point, show the gridline for that single data point. [See spec for example](https://guaranteedrate.invisionapp.com/console/share/H8294RL6R3/516032380). This may not be necessary if using the chart with point radii.
- If using the chart without point radii, figure out how to add radii to only the ends of the "Average estimate" line, per [spec](https://guaranteedrate.invisionapp.com/console/share/H8294RL6R3/516032380).

# Questions

- In case data fetch fails, what needs to be rendered? No component? Placeholder image?
- If "home value estimate" calculation is negative, should it still be rendered? If so, should it be a different color?
  - Positive dollar amount has plus sign in front of dollar sign, and negative dollar amount has minus sign in front of dollar sign; however, positive percent does not have plus sign, while negative percent has minus sign. Should we only have one plus/minus sign, with its location in front of the dollar amount, and no plus/minus sign associated with the percentage?
- Do we need to incorporate different currencies?
