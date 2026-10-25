from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Pokemon
from .serializers import PokemonSerializer


def unauthorized():
    return Response({'detail': 'Authentication required.'},
                    status=status.HTTP_401_UNAUTHORIZED)


class PokemonListCreateAPIView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return unauthorized()
        pokemons = Pokemon.objects.all()
        serializer = PokemonSerializer(pokemons, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not request.user.is_authenticated:
            return unauthorized()
        serializer = PokemonSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PokemonRetrieveUpdateDestroyAPIView(APIView):
    def get(self, request, pk):
        if not request.user.is_authenticated:
            return unauthorized()
        pokemon = get_object_or_404(Pokemon, pk=pk)
        serializer = PokemonSerializer(pokemon, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        if not request.user.is_authenticated:
            return unauthorized()
        pokemon = get_object_or_404(Pokemon, pk=pk)
        serializer = PokemonSerializer(pokemon, data=request.data, partial=True,
                                       context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_authenticated:
            return unauthorized()
        pokemon = get_object_or_404(Pokemon, pk=pk)
        pokemon.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)