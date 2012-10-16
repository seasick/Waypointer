/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */

#pragma strict

// We need the Queue from .NET
import System.Collections.Generic;

class Waypointer extends MonoBehaviour 
{
  var speed : float = 3.0; // At which speed should your transform move?
  var scale : Vector3 = Vector3(2,1,2); // The scale of the collider box
  
  // This queue will hold the waypoints. 
  private var queue : Queue.<GameObject> = new Queue.<GameObject>();

  function Update() 
  {
    // Get the current waypoint
    var waypoint : GameObject = GetCurrentWaypoint();
  
    if (waypoint != null) {
      // Move to the current waypoint
      transform.position = Vector3.MoveTowards(
        transform.position, 
        waypoint.transform.position, 
        Time.deltaTime * speed
      );
      
      // Look to the current waypoint
      transform.rotation = Quaternion.LookRotation(
        waypoint.transform.position - transform.position
      );
    }
  }

  function AddWaypoint(targetPosition : Vector3) 
  {
  	// Create a collider so we know, when your gameObject reaches the waypoint
  	var collider : GameObject = new GameObject();
  	collider.name = 'Waypoint';
	
	  // We need some components. The collider (obviosly) to detect a collision, 
    // and the Waypoint class to inform us about hitting the waypoint.
  	collider.AddComponent(BoxCollider);
  	collider.AddComponent(Waypoint);
		
    // Enable the trigger
    collider.collider.isTrigger = true;
    collider.collider.transform.localScale = scale;
    
    collider.transform.position = targetPosition;
    
    // Add the waypoint to the queue
	  queue.Enqueue(collider);
  }
  
  function GetCurrentWaypoint()
  {
    if (queue.Count > 0) {
	    return queue.Peek();
	  }
	  return null;
  }
  
  function HitWaypoint(waypoint : GameObject)
  {
    // We need to remove this waypoint from the list
    if (queue.Count > 0 && queue.Peek() == waypoint) {
      queue.Dequeue();
      Destroy(waypoint);
    }
  }
}

// Component for checking that your moving whatever is reaching the waypoint
class Waypoint extends MonoBehaviour
{
  function OnTriggerEnter(other : Collider)
  {
    if (other.GetComponent(Waypointer) != null) {
      other.GetComponent(Waypointer).HitWaypoint(gameObject);
    }
  }
}
