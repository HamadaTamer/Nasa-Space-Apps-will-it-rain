from final_predictor import WeatherPredictor

# One line prediction
predictor = WeatherPredictor()
result = predictor.predict_single(2024, 22.0, 25.625, 6)
save_predictions = predictor.save_predictions([result], "predictions")