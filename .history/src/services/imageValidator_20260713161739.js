import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

export const validateCropImage =
  async (imgElement) => {
    const model =
      await mobilenet.load();

    const predictions =
      await model.classify(
        imgElement
      );

    return predictions;
  };