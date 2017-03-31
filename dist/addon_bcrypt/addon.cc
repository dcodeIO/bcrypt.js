// addon.cc
#include <node.h>
#include "bcrypt.h"

namespace demo {

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports) {
  BCrypt::Init(exports);
}

NODE_MODULE(addon, InitAll)

}  // namespace demo
