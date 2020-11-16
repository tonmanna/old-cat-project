port module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (class, for, id, placeholder, type_, value)
import Html.Events exposing (onClick, onInput, onSubmit)
import List


port sendToNG : String -> Cmd msg


port ngValueReceived : (String -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    ngValueReceived NgValueReceived


type alias Model =
    { playerName : String
    , ngValues : List ( String, Bool )
    , lastSubmit : String
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { playerName = ""
      , ngValues = []
      , lastSubmit = ""
      }
    , Cmd.none
    )


type Msg
    = NgValueReceived String
    | PlayerNameChanged String
    | PlayerNameSubmit


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NgValueReceived value ->
            ( { model
                | ngValues =
                    ( value
                    , removeVowels value
                        |> containsChar model.lastSubmit
                    )
                        :: model.ngValues
              }
            , Cmd.none
            )

        PlayerNameChanged name ->
            ( { model | playerName = name }, Cmd.none )

        PlayerNameSubmit ->
            ( { model | lastSubmit = model.playerName }, sendToNG model.playerName )


view : Model -> Html Msg
view model =
    div [ class "py-4" ]
        [ h1 [ class "text-xl font-bold" ]
            [ text "Elm is here!" ]
        , form [ onSubmit PlayerNameSubmit ]
            [ div []
                [ label [ class "block text-sm font-medium leading-5 text-gray-700", for "email" ]
                    [ text "Player Name" ]
                , div [ class "mt-1 flex rounded-md shadow-sm" ]
                    [ div [ class "relative flex items-stretch flex-grow focus-within:z-10" ]
                        [ input
                            [ class "form-input block w-full rounded-none rounded-l-md border border-gray-300 pl-4 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                            , id "playerName"
                            , placeholder "Salah"
                            , value model.playerName
                            , onInput PlayerNameChanged
                            ]
                            []
                        ]
                    , button
                        [ class "-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
                        , type_ "submit"
                        ]
                        [ span [ class "ml-2" ]
                            [ text "Send" ]
                        ]
                    ]
                ]
            ]
        , h1 [ class "mt-8 text-xl font-bold" ]
            [ text "Received" ]
        , ul [ class "mt-4" ] <|
            List.map
                (\( v, flag ) ->
                    li []
                        [ if flag then
                            text <| v ++ " ✅"

                          else
                            text <| v ++ " ❌"
                        ]
                )
                model.ngValues
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


removeVowels : String -> String
removeVowels original =
    String.filter (\c -> List.member c [ 'a', 'e', 'i', 'o', 'u' ]) original


containsChar : String -> String -> Bool
containsChar str input =
    let
        chars =
            String.toList input
    in
    String.filter (\c -> List.member c chars) str
        |> String.toList
        |> List.isEmpty
