#include <napi.h>
#include <stdio.h>
#include <iostream>
#include <fstream>
#include <string>

using namespace std;

Napi::Value calculate_box_vertices(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    if (info.Length() < 3)
    {
        Napi::TypeError::New(env, "Wrong number of arguments " + std::to_string(info.Length()))
            .ThrowAsJavaScriptException();
        return env.Null();
    }
    if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
    {
        Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
        return env.Null();
    }
    double w = info[0].As<Napi::Number>().DoubleValue(); //width
    double h = info[1].As<Napi::Number>().DoubleValue(); //height
    double l = info[2].As<Napi::Number>().DoubleValue(); //length

    double vertices[8][3] = {{0, 0, 0},  //0
                             {w, 0, 0},  //1
                             {0, h, 0},  //2
                             {w, h, 0},  //3
                             {0, 0, l},  //4
                             {w, 0, l},  //5
                             {0, h, l},  //6
                             {w, h, l}}; //7

    // moving to center
    for (uint32_t i = 0; i < 8; i++) {
        vertices[i][0] -= w * 0.5;
        vertices[i][1] -= h * 0.5;
        vertices[i][2] -= l * 0.5;
    }

    double triangles[12][3] = {
        // front
        {0, 3, 2},
        {0, 1, 3},
        // right
        {1, 7, 3},
        {1, 5, 7},
        // back
        {5, 6, 7},
        {5, 4, 6},
        // left
        {4, 2, 6},
        {4, 0, 2},
        // top
        {2, 7, 6},
        {2, 3, 7},
        // bottom
        {4, 1, 0},
        {4, 5, 1}};

    Napi::Object arrOfVertices = Napi::Object::New(env);
    for (uint32_t i = 0; i < 8; i++)
    {
        Napi::Object obj = Napi::Object::New(env);
        for (uint32_t j = 0; j < 3; j++)
        {
            obj.Set(j, vertices[i][j]);
        }
        arrOfVertices.Set(i, obj);
    }

    Napi::Object arrOfTriangles = Napi::Object::New(env);
    for (uint32_t i = 0; i < 12; i++)
    {
        Napi::Object obj = Napi::Object::New(env);
        for (uint32_t j = 0; j < 3; j++)
        {
            obj.Set(j, triangles[i][j]);
        }
        arrOfTriangles.Set(i, obj);
    }

    Napi::Object res = Napi::Object::New(env);
    res.Set("vertices", arrOfVertices);
    res.Set("triangles", arrOfTriangles);
    return res;
}

Napi::Object init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "calculate_box_vertices"), Napi::Function::New(env, calculate_box_vertices));
    return exports;
};

NODE_API_MODULE(box_geometry, init);