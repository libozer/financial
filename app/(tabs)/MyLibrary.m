#import "MyLibrary.c"
#import <React/RCTBridgeModule.h>

@implementation MyLibrary

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(calculateAmount:(double)currentAmount additionalAmount:(double)additionalAmount resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    double result = calculateAmount(currentAmount, additionalAmount);
    resolve(@(result)); // Возвращаем результат в JavaScript
}

@end
