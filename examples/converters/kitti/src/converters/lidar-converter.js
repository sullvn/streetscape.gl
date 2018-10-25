/* eslint-disable camelcase */
import uuid from 'uuid/v4';

import BaseConverter from './base-converter';
import {loadLidarData} from '../parsers/parse-lidar-points';

// load file
export default class LidarConverter extends BaseConverter {
  constructor(rootDir, streamDir, {disabledStreams = []} = {}) {
    super(rootDir, streamDir);

    this.LIDAR_POINTS = '/lidar/points';

    this.disabled = disabledStreams
      .map(pattern => RegExp(pattern).test(this.LIDAR_POINTS))
      .some(x => x === true);
  }

  async convertFrame(frameNumber, xvizBuilder) {
    if (this.disabled) {
      return;
    }

    const {data} = await this.loadFrame(frameNumber);
    const lidarData = loadLidarData(data);

    // This encode/parse is a temporary workaround until we get fine-grain
    // control of which streams should be packed in the binary.
    // By doing this we are able to have the points converted to the appropriate
    // TypedArray, and by unpacking them, they are in a JSON structure that
    // works better with the rest of the conversion.
    const temporaryObject = {vertices: lidarData.positions};

    xvizBuilder
      .primitive(this.LIDAR_POINTS)
      .points(temporaryObject.vertices)
      .id(uuid())
      .style({
        color: [0, 0, 0, 255]
      });
  }

  getMetadata(xvizMetaBuilder) {
    const xb = xvizMetaBuilder;
    xb.stream(this.LIDAR_POINTS)
      .category('primitive')
      .type('point')
      .streamStyle({
        fill_color: '#00a',
        radius_pixels: 2
      })
      // laser scanner relative to GPS position
      // http://www.cvlibs.net/datasets/kitti/setup.php
      .pose({
        x: 0.81,
        y: -0.32,
        z: 1.73
      });
  }
}
