// bcrypt.h
#ifndef BCRYPT_H
#define BCRYPT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class BCrypt : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
  explicit BCrypt();
  ~BCrypt();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);

  void _encipher_cpp(std::uint32_t *lr, std::uint32_t offVal);
  static void _encipher(const v8::FunctionCallbackInfo<v8::Value>& args);

  void _key_cpp(std::uint32_t *arrKey, uint32_t lenKey);
  static void _key(const v8::FunctionCallbackInfo<v8::Value>& args);

  void _ekskey_cpp(std::uint32_t *arrData, uint32_t lenData,
                   std::uint32_t *arrKey, uint32_t lenKey);
  static void _ekskey(const v8::FunctionCallbackInfo<v8::Value>& args);

  static v8::Persistent<v8::Function> constructor;
  
  static const std::uint32_t BLOWFISH_NUM_ROUNDS = 16;

  static const std::uint32_t m_len_P = 18;
  static const std::uint32_t m_arrP_ORIG[m_len_P];
  std::uint32_t m_arrP[m_len_P];

  static const std::uint32_t m_len_S = 1024;
  static const std::uint32_t m_arrS_ORIG[m_len_S];
  std::uint32_t m_arrS[m_len_S];

  inline void initPS_cpp();
  static void initPS(const v8::FunctionCallbackInfo<v8::Value>& args);

};

}  // namespace demo

#endif //BCRYPT_H
